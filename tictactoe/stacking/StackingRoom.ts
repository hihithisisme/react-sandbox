import { Player, Room } from '../../websocket/room';
import * as WebSocket from 'ws';
import { newStackingGame } from './stackingGame';

const gameSize = 3;

export class StackingRoom extends Room<StackingPlayer> {
    squares!: Array<string | null>;

    turnSign!: string;
    playerIndexWhoStartsFirst!: number;

    constructor(roomId: string) {
        super(roomId);
        this.reset();
    }

    reset() {
        this.playerIndexWhoStartsFirst = Math.random() < 0.5 ? 0 : 1;
        const game = newStackingGame(gameSize, true);

        this.squares = game.squares;
        this.turnSign = game.playerSign;
        if (this.isReady()) {
            this.players[0].remainingPieces = [...game.playerRemainingPieces];
            this.players[1].remainingPieces = [...game.playerRemainingPieces];
        }
    }

    isReady(): boolean {
        this.removeDisconnectedPlayers();
        return this.players.length === 2;
    }
}

export class StackingPlayer extends Player {
    public remainingPieces: number[] = [];

    constructor(id: string, socket: WebSocket) {
        super(id, socket);
    }
}
