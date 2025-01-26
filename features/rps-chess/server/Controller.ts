import { randomUUID } from 'crypto';
import * as http from 'http';
import * as WebSocket from 'ws';
import { WsController } from '../../../websocket/controller';
import { MessageWithState } from '../../../websocket/room';
import { ICommand, InitCmd, MoveCmd } from '../logic/message';
import { OnlinePlayer, OnlineRoom } from './OnlineRoom';

export class RpsChessController extends WsController<
    ICommand,
    OnlinePlayer,
    OnlineRoom
> {
    constructor() {
        super();
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const roomId = this.getRoomId(request);
        console.log(`connection: roomId={${roomId}}`);

        const room = this.getRoom(request) || new OnlineRoom(roomId);
        const player = new OnlinePlayer(randomUUID(), ws);
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
                console.log('unrecognised action:', state.message);
                return;
        }
    }

    private onMove(state: MessageWithState<ICommand>) {
        const data = state.message.data as MoveCmd;
        const room = this.getRoom(state.request);
        // TODO: implement me

        // validation

        // update BE state

        // propagate to clients
        this.emitToAllPlayers(room, state.message);
    }

    private emitInit(room: OnlineRoom) {
        room.reset();

        room.players.forEach((player) => {
            const game = room.game;
            if (!game) {
                throw new Error('unexpected state. No game in room found');
            }
            this.emitToPlayer(player, {
                action: 'INIT',
                data: {
                    gameSettings: room.gameSettings,
                    gameState: game.state,
                } as InitCmd,
            });
        });
    }
}
