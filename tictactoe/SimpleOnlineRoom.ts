import { Player, Room } from '../websocket/room';
import * as WebSocket from 'ws';

const gameSize = 3;

export class SimpleOnlineRoom extends Room<OnlineBaseTTTPlayer> {
    squares!: Array<string | null>;
    turnSign!: string;
    playerIndexWhoStartsFirst!: number;

    constructor(roomId: string) {
        super(roomId);
        this.reset();
    }

    reset() {
        this.playerIndexWhoStartsFirst = Math.random() < 0.5 ? 0 : 1;
        this.squares = Array(gameSize ** 2).fill(null);
        this.turnSign = Math.random() < 0.5 ? 'X' : 'O';
    }

    isReady(): boolean {
        this.removeDisconnectedPlayers();
        return this.players.length === 2;
    }
}

export class OnlineBaseTTTPlayer extends Player {
    constructor(id: string, socket: WebSocket) {
        super(id, socket);
    }
}
