import * as WebSocket from 'ws';
import { ReadyState } from 'react-use-websocket';
import http from 'http';

export interface MessageWithState<T> {
    message: T;
    player: Player;
    request: http.IncomingMessage;
}

export class Player {
    public id: string;
    public socket: WebSocket;
    public sign: string | undefined;
    public turn: boolean | undefined;

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
