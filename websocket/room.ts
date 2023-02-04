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
    #socket: WebSocket;

    protected constructor(id: string, socket: WebSocket) {
        this.id = id;
        this.#socket = socket;
    }

    public send(message: any): void {
        if (this.#socket.readyState == ReadyState.OPEN) {
            this.#socket.send(JSON.stringify(message));
        }
    }

    public getState(): ReadyState {
        return this.#socket.readyState;
    }
}

export abstract class Room<P extends Player> {
    public players: P[];
    public roomId: string;

    protected constructor(roomId: string) {
        this.players = [];
        this.roomId = roomId;
    }

    public getPlayerById(id: string): P | null {
        for (const player of this.players) {
            if (id === player.id) {
                return player;
            }
        }
        return null;
    }

    public addPlayer(player: P): void {
        this.players.push(player);
    }

    abstract reset(): void;

    abstract isReady(): boolean;

    protected removeDisconnectedPlayers() {
        this.players = this.players.filter((player) => {
            return ![ReadyState.CLOSING, ReadyState.CLOSED].includes(player.getState());
        });
    }
}
