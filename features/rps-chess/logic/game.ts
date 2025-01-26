import { Player } from '../../../websocket/room';
import { IGameSettings, IGameState, Piece, toCoordString } from './data';

export default class RpsChessGame {
    state: IGameState;
    settings: IGameSettings;
    players: Player[];

    constructor(players: Player[]) {
        const firstPlayerId =
            Math.random() < 0.5 ? players[0].id : players[1].id;
        this.settings = {
            firstPlayerId,
            playerIdToDisplayColor: new Map([
                [
                    players[0].id,
                    firstPlayerId == players[0].id ? 'white' : 'black',
                ],
                [
                    players[1].id,
                    firstPlayerId == players[1].id ? 'white' : 'black',
                ],
            ]),
        };
        this.players = players;
        this.state = {
            remainingPieces: this.buildInitialPieces(),
            currentPlayerId: this.settings.firstPlayerId,
        };
    }

    // starts off with 2 scissors, 1 rock, 1 paper dices
    buildInitialPieces(): Map<string, Piece> {
        const pieces = new Map<string, Piece>();
        const player1Id = this.players[0].id;
        const player2Id = this.players[1].id;
        pieces.set(
            toCoordString(0, 0),
            Piece.buildInitialScissorDice('1', player1Id)
        );
        pieces.set(
            toCoordString(2, 0),
            Piece.buildInitialRockDice('2', player1Id)
        );
        pieces.set(
            toCoordString(4, 0),
            Piece.buildInitialPaperDice('3', player1Id)
        );
        pieces.set(
            toCoordString(6, 0),
            Piece.buildInitialScissorDice('4', player1Id)
        );

        pieces.set(
            toCoordString(0, 1),
            Piece.buildInitialScissorDice('1', player2Id)
        );
        pieces.set(
            toCoordString(0, 3),
            Piece.buildInitialRockDice('2', player2Id)
        );
        pieces.set(
            toCoordString(0, 5),
            Piece.buildInitialPaperDice('3', player2Id)
        );
        pieces.set(
            toCoordString(0, 7),
            Piece.buildInitialScissorDice('4', player2Id)
        );
        return pieces;
    }
}
