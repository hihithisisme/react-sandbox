import * as WebSocket from 'ws';
import { ReadyState } from 'react-use-websocket';
import http from 'http';

export interface MessageWithState<T> {
    message: T;
    player: Player;
    request: http.IncomingMessage;
}

export abstract class Player {
    public id: string;
    public socket: WebSocket;

    protected constructor(id: string, socket: WebSocket) {
        this.id = id;
        this.socket = socket;
    }

    public send(message: any): void {
        if (this.socket.readyState == ReadyState.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }
}

export abstract class Room {
    public players: Player[];
    public roomId: string;

    protected constructor(roomId: string) {
        this.players = [];
        this.roomId = roomId;
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    abstract reset(): void;

    abstract isReady(): boolean;

    protected removeDisconnectedPlayers() {
        this.players = this.players.filter((player) => {
            return ![ReadyState.CLOSING, ReadyState.CLOSED].includes(
                player.socket.readyState
            );
        });
    }
}
