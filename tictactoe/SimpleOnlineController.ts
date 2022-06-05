import * as WebSocket from 'ws';
import * as http from 'http';
import { randomUUID } from 'crypto';
import { OnlineBaseTTTPlayer, SimpleOnlineRoom } from './SimpleOnlineRoom';
import { ICommand, InitCmd, MoveCmd } from './messages';
import { otherPlayerSign } from './game';
import { MessageWithState } from '../websocket/room';
import { WsController } from '../websocket/controller';

export class SimpleOnlineController extends WsController<ICommand, OnlineBaseTTTPlayer, SimpleOnlineRoom> {
    constructor() {
        super();
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const roomId = this.getRoomId(request);
        console.log(`connection: roomId={${roomId}}`);

        const room = this.getRoom(request) || new SimpleOnlineRoom(roomId);
        const player = new OnlineBaseTTTPlayer(randomUUID(), ws);
        room.addPlayer(player);
        this.setRoom(room);

        this.defaultAddOnMessage(ws, request, player);
        this.defaultScheduledPing(ws);

        if (room.isReady()) {
            this.emitInit(room);
        }
    }

    onMessage(state: MessageWithState<ICommand>): void {
        console.log(`message:`, state.message);

        switch (state.message.action) {
            case 'RESET': {
                return this.emitInit(this.getRoom(state.request));
            }
            case 'MOVE': {
                return this.onMove(state);
            }
            default:
                console.log('unrecognisable action:', state.message);
                return;
        }
    }

    private onMove(state: MessageWithState<ICommand>) {
        const data = state.message.data as MoveCmd;
        const { move, playerSign } = data;
        const room = this.getRoom(state.request);
        const { squares } = room;

        // VALIDATION
        if (squares[move] !== null) {
            console.log(`Invalid move by player. Square is already occupied. Move=${move}, squares=`, room.squares);
            return;
        } else if (data.playerSign !== room.turnSign) {
            console.log(`Invalid move by player. Not player's turn.`, data);
            return;
        }

        // UPDATE BE STATE
        squares[move] = playerSign;
        room.turnSign = otherPlayerSign(room.turnSign);

        // PASSING ON MESSAGE
        this.emitToAllPlayers(room, state.message);
    }

    private emitInit(room: SimpleOnlineRoom) {
        room.reset();

        room.players.forEach((player, index) => {
            const isFirstPlayer = room.playerIndexWhoStartsFirst === index;

            this.emitToPlayer(player, {
                action: 'INIT',
                data: {
                    squares: room.squares,
                    playerSign: isFirstPlayer ? room.turnSign : otherPlayerSign(room.turnSign),
                    playerTurn: isFirstPlayer,
                } as InitCmd,
            });
        });
    }
}
