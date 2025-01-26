import { IGameState, Piece, PlayerColor, toCoordString } from './data';

export default class RpsChessGame {
    state: IGameState;
    constructor() {
        this.state = {
            remainingPieces: RpsChessGame.buildInitialPieces(),
            currentPlayer: PlayerColor.WHITE,
        };
    }

    // starts off with 2 scissors, 1 rock, 1 paper dices
    static buildInitialPieces(): Map<string, Piece> {
        const pieces = new Map<string, Piece>();
        pieces.set(
            toCoordString(0, 0),
            Piece.buildInitialScissorDice('1', PlayerColor.WHITE)
        );
        pieces.set(
            toCoordString(2, 0),
            Piece.buildInitialRockDice('2', PlayerColor.WHITE)
        );
        pieces.set(
            toCoordString(4, 0),
            Piece.buildInitialPaperDice('3', PlayerColor.WHITE)
        );
        pieces.set(
            toCoordString(6, 0),
            Piece.buildInitialScissorDice('4', PlayerColor.WHITE)
        );

        pieces.set(
            toCoordString(1, 7),
            Piece.buildInitialScissorDice('1', PlayerColor.BLACK)
        );
        pieces.set(
            toCoordString(3, 7),
            Piece.buildInitialRockDice('2', PlayerColor.BLACK)
        );
        pieces.set(
            toCoordString(5, 7),
            Piece.buildInitialPaperDice('3', PlayerColor.BLACK)
        );
        pieces.set(
            toCoordString(7, 7),
            Piece.buildInitialScissorDice('4', PlayerColor.BLACK)
        );
        return pieces;
    }
}
