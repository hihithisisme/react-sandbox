import * as WebSocket from 'ws';
import * as http from 'http';
import Buffer from 'buffer';
import { randomUUID } from 'crypto';
import { MessageWithState, Player, Room } from './TicTacToeRoom';
import { ICommand, InitCmd, MoveCmd } from './commands';
import { ReadyState } from 'react-use-websocket';

const gameSize = 3;

class TicTacToeRoom extends Room {
    public squares!: Array<string | null>;

    constructor(roomId: string) {
        super(roomId);
        this.newBoard();
    }

    public reset() {
        this.newBoard();
        const firstPlayerTurn = Math.random() < 0.5;
        const firstPlayerSign = Math.random() < 0.5 ? 'X' : 'O';

        this.players[0].turn = firstPlayerTurn;
        this.players[0].sign = firstPlayerSign;
        this.players[1].turn = !firstPlayerTurn;
        this.players[1].sign = firstPlayerSign === 'X' ? 'O' : 'X';
    }

    private newBoard() {
        this.squares = Array(gameSize ** 2).fill(null);
    }

    isReady(): boolean {
        this.removeDisconnectedPlayers();
        return this.players.length === 2;
    }

    private removeDisconnectedPlayers() {
        this.players = this.players.filter((player) => {
            return ![ReadyState.CLOSING, ReadyState.CLOSED].includes(
                player.socket.readyState
            );
        });
    }
}

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
        // this.pingPong(state);
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
        return params.get('code')!;
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
                `Invalid move by player. Something is wrong. Move=${move}, squares=`,
                room.squares
            );
        }
        // UPDATE BE STATE
        squares[move] = playerSign;

        // PASSING ON MESSAGE
        this.emitToAllPlayers(room, state.message);
    }

    private emitInit(room: TicTacToeRoom) {
        room.reset();

        room.players.forEach((player) => {
            this.emitToPlayer(player, {
                action: 'INIT',
                data: {
                    squares: room.squares,
                    playerSign: player.sign,
                    playerTurn: player.turn,
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
