import * as WebSocket from 'ws';
import * as http from 'http';
import Buffer from 'buffer';
import { randomUUID } from 'crypto';
import { MessageWithState, Player, Room } from './_room';

const gameSize = 3;

class TicTacToeRoom extends Room {
    public squares: Array<string | null>;

    constructor(roomId: string, squares: Array<string | null>) {
        super(roomId);
        this.squares = squares;
    }
}

interface IMove {
    // squares: Array<string | null>;
    move: number;
    playerSign: string;
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

        const room =
            this.getRoom(request) ||
            new TicTacToeRoom(roomId, Array(gameSize ** 2).fill(null));
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
    }

    onMessage(state: MessageWithState<IMove>): void {
        this.pingPong(state);

        // const room = this.getRoom(state.request);
        // console.log(`message:`, state.message);
        //
        // const { move, playerSign } = state.message;
        // const { squares } = room;
        //
        // if (squares[move] !== null) {
        //     console.log(
        //         `Invalid move by player. Something is wrong. Move=${move}, squares=`,
        //         room.squares
        //     );
        // } else {
        //     squares[move] = playerSign;
        //     room.players.forEach((player) => {
        //         if (player.id !== state.player.id) {
        //             player.send({
        //                 data: state.message,
        //             });
        //         }
        //     });
        // }
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
}

/*
 * 1. P1 makes a move: -> BE
 * 2. BE validates the move against board state (persisted in-memory?)
 * 3. BE adjust board state
 * 4. BE forwards the board state to P2
 *
 *
 * */
