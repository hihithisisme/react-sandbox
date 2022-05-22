import * as WebSocket from 'ws';
import * as http from 'http';
import Buffer from 'buffer';
import { randomUUID } from 'crypto';
import { MessageWithState, Player, TicTacToeRoom } from './TicTacToeRoom';
import { ICommand, InitCmd, MoveCmd } from './commands';
import { otherPlayerSign } from './game';

export class WsTicTacToe {
    // TODO: abstract roomMap management into an abstract class
    public roomMap: { [key: string]: TicTacToeRoom };

    constructor() {
        this.roomMap = {};
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const roomId = this.getRoomId(request);
        console.log(`connection: roomId={${roomId}}`);

        const room = this.getRoom(request) || new TicTacToeRoom(roomId);
        const player = new Player(randomUUID(), ws);
        room.addPlayer(player);
        this.setRoom(room);

        ws.on('message', (data: Buffer) => {
            const parsedData = JSON.parse(data.toString());
            this.onMessage({
                message: parsedData,
                player,
                request,
            });
        });

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

    private emitToAllPlayers(room: TicTacToeRoom, command: ICommand) {
        room.players.forEach((player) => {
            this.emitToPlayer(player, command);
        });
    }

    private emitToPlayer(player: Player, command: ICommand) {
        player.send(command);
    }

    private getRoomId(request: http.IncomingMessage): string {
        const params = new URL(request.url!, `ws://${request.headers.host}`)
            .searchParams;
        return params.get('roomId')!;
    }

    private getRoom(request: http.IncomingMessage): TicTacToeRoom {
        return this.roomMap[this.getRoomId(request)];
    }

    private setRoom(room: TicTacToeRoom): void {
        this.roomMap[room.roomId] = room;
    }

    pingPong(state: MessageWithState<object>): void {
        const room = this.getRoom(state.request);
        console.log(`message:`, state.message);

        room.players.forEach((player) => {
            if (player.id !== state.player.id) {
                player.send({
                    data: state.message,
                });
            }
        });
    }

    private onMove(state: MessageWithState<ICommand>) {
        const data = state.message.data as MoveCmd;
        const { move, playerSign } = data;
        const room = this.getRoom(state.request);
        const { squares } = room;

        // VALIDATION
        if (squares[move] !== null) {
            console.log(
                `Invalid move by player. Square is already occupied. Move=${move}, squares=`,
                room.squares
            );
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

    private emitInit(room: TicTacToeRoom) {
        room.reset();

        room.players.forEach((player, index) => {
            const isFirstPlayer = room.playerIndexWhoStartsFirst === index;

            this.emitToPlayer(player, {
                action: 'INIT',
                data: {
                    squares: room.squares,
                    playerSign: isFirstPlayer
                        ? room.turnSign
                        : otherPlayerSign(room.turnSign),
                    playerTurn: isFirstPlayer,
                } as InitCmd,
            });
        });
    }
}

/*
 * 1. P1 makes a move: -> BE
 * 2. BE validates the move against board state (persisted in-memory?)
 * 3. BE adjust board state
 * 4. BE forwards the board state to P2
 *
 *
 * */
