import * as WebSocket from 'ws';
import { Player, Room } from '../../../websocket/room';
import { IGameSettings, PlayerColor } from '../logic/data';
import RpsChessGame from '../logic/game';

const gameSize = 3;

export class OnlineRoom extends Room<OnlinePlayer> {
    game?: RpsChessGame;
    gameSettings?: IGameSettings;

    constructor(roomId: string) {
        super(roomId);
        const firstPlayer = Math.random() < 0.5 ? 0 : 1;
        const firstPlayerId = this.players[firstPlayer].id;
        this.gameSettings = {
            firstPlayerId,
            playerIdToDisplayColor: new Map([
                [
                    this.players[0].id,
                    firstPlayerId == this.players[0].id
                        ? PlayerColor.WHITE
                        : PlayerColor.BLACK,
                ],
                [
                    this.players[1].id,
                    firstPlayerId == this.players[1].id
                        ? PlayerColor.WHITE
                        : PlayerColor.BLACK,
                ],
            ]),
        };
    }

    reset() {
        this.game = new RpsChessGame();
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
