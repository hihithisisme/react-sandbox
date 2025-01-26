import * as WebSocket from 'ws';
import { Player, Room } from '../../../websocket/room';
import RpsChessGame from '../logic/game';

const gameSize = 3;

export class OnlineRoom extends Room<OnlinePlayer> {
    game?: RpsChessGame;

    constructor(roomId: string) {
        super(roomId);
    }

    reset() {
        this.game = new RpsChessGame(this.players);
    }

    isReady(): boolean {
        this.removeDisconnectedPlayers();
        return this.players.length === 2;
    }
}

export class OnlinePlayer extends Player {
    constructor(id: string, socket: WebSocket) {
        super(id, socket);
    }
}
