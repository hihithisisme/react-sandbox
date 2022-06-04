import * as WebSocket from 'ws';
import * as http from 'http';
import { randomUUID } from 'crypto';
import { StackingPlayer, StackingRoom } from './StackingRoom';
import { ICommand, InitCmd, MoveCmd } from './messages';
import { otherPlayerSign } from '../game';
import { MessageWithState } from '../../websocket/room';
import { WsController } from '../../websocket/controller';
import { decodeSign } from '../squareSign';

export class StackingController extends WsController<ICommand, StackingPlayer, StackingRoom> {
    constructor() {
        super();
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const roomId = this.getRoomId(request);
        console.log(`connection: roomId={${roomId}}`);

        const room = this.getRoom(request) || new StackingRoom(roomId);
        const player = new StackingPlayer(randomUUID(), ws);
        room.addPlayer(player);
        this.setRoom(room);

        this.defaultAddOnMessage(ws, request, player);

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
        const room = this.getRoom(state.request);

        const relativeSize = decodeSign(data.playerSign).relativeSize!;
        const remainingPieces = this.getSourcePlayer(state).remainingPieces;

        // VALIDATION
        if (!this.isPlayerTurn(data.playerSign, room.turnSign)) {
            console.log(`Invalid move by player. Not player's turn.`, data);
            return;
        } else if (!this.isPlayerSignLarger(data.playerSign, room.squares[data.move])) {
            console.log(
                `Invalid move by player. Not using a large enough square.`,
                data.playerSign,
                room.squares[data.move]
            );
            return;
        } else if (remainingPieces[relativeSize] <= 0) {
            console.log(
                `Invalid move by player. Trying to use more pieces than allocated.`,
                data.playerSign,
                remainingPieces
            );
            return;
        }

        // UPDATE BE STATE
        room.squares[data.move] = data.playerSign;
        room.turnSign = otherPlayerSign(room.turnSign);
        remainingPieces[relativeSize] -= 1;

        // PASSING ON MESSAGE
        room.players.forEach((player: StackingPlayer) => {
            const isSourcePlayer = player.id === state.player.id;
            const oppPlayerRemainingPieces = this.getOppPlayer(player, room).remainingPieces;
            const command = {
                action: 'MOVE',
                data: {
                    ...state.message.data,
                    playerRemainingPieces: isSourcePlayer ? player.remainingPieces : oppPlayerRemainingPieces,
                    oppRemainingPieces: isSourcePlayer ? oppPlayerRemainingPieces : player.remainingPieces,
                } as MoveCmd,
            };
            this.emitToPlayer(player, command);
        });
    }

    private getOppPlayer(player: StackingPlayer, room: StackingRoom): StackingPlayer {
        const players = room.players;
        if (player.id === players[0].id) {
            return players[1];
        } else {
            return players[0];
        }
    }

    private isPlayerTurn(playerSign: string, turnSign: string): boolean {
        return playerSign[0] === turnSign[0];
    }

    private isPlayerSignLarger(playerSign: string, existingSign: string | null): boolean {
        if (existingSign === null) {
            return true;
        }

        return decodeSign(playerSign).relativeSize! > decodeSign(existingSign).relativeSize!;
    }

    private emitInit(room: StackingRoom) {
        room.reset();

        room.players.forEach((player, index) => {
            const isFirstPlayer = room.playerIndexWhoStartsFirst === index;

            this.emitToPlayer(player, {
                action: 'INIT',
                data: {
                    squares: room.squares,
                    playerSign: isFirstPlayer ? room.turnSign : otherPlayerSign(room.turnSign),
                    playerTurn: isFirstPlayer,
                    playerRemainingPieces: player.remainingPieces,
                    oppRemainingPieces: this.getOppPlayer(player, room).remainingPieces,
                } as InitCmd,
            });
        });
    }
}
