import { otherPlayerSign } from './game';
import { Player, Room } from '../websocket/room';
import * as WebSocket from 'ws';

const gameSize = 3;

export class SimpleOnlineRoom extends Room {
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
}

export class OnlineBaseTTTPlayer extends Player {
    constructor(id: string, socket: WebSocket) {
        super(id, socket);
    }
}
