import * as WebSocket from 'ws';
import { ReadyState } from 'react-use-websocket';
import http from 'http';
import { otherPlayerSign } from './game';

export interface MessageWithState<T> {
    message: T;
    player: Player;
    request: http.IncomingMessage;
}

export class Player {
    public id: string;
    public socket: WebSocket;

    constructor(id: string, socket: WebSocket) {
        this.id = id;
        this.socket = socket;
    }

    public send(message: object): void {
        if (this.socket.readyState == ReadyState.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }
}

export class Room {
    public players: Player[];
    public roomId: string;

    constructor(roomId: string) {
        this.players = [];
        this.roomId = roomId;
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }
}

const gameSize = 3;

export class TicTacToeRoom extends Room {
    public squares!: Array<string | null>;
    public turnSign!: string;
    public playerIndexWhoStartsFirst!: number;

    constructor(roomId: string) {
        super(roomId);
        this.reset();
    }

    reset() {
        this.playerIndexWhoStartsFirst = Math.random() < 0.5 ? 0 : 1;
        const sign = Math.random() < 0.5 ? 'X' : 'O';

        this.squares = Array(gameSize ** 2).fill(null);
        this.turnSign = sign ? sign : otherPlayerSign(sign);
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
