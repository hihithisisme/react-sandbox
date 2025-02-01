import {
    addCoords,
    Coordinate,
    coordToString,
    DiceFace,
    Direction,
    DIRECTION_MAP,
    eqCoords,
    IGameState,
    Piece,
    PlayerColor,
    toCoordString,
} from './data';
import Trie, { NodeData } from './trie';

export const MAX_MOVES_FOR_DICE_FACE = {
    [DiceFace.PAPER]: 5,
    [DiceFace.ROCK]: 3,
    [DiceFace.SCISSOR]: 2,
} as const;

const gameSize = 8;
export default class RpsChessGame {
    state: IGameState;
    constructor(state?: IGameState) {
        this.state = state || {
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
            Piece.buildInitialPaperDice('2', PlayerColor.BLACK)
        );
        pieces.set(
            toCoordString(5, 7),
            Piece.buildInitialRockDice('3', PlayerColor.BLACK)
        );
        pieces.set(
            toCoordString(7, 7),
            Piece.buildInitialScissorDice('4', PlayerColor.BLACK)
        );
        return pieces;
    }

    // No need to serialize/deserialize over the wire since we can compute it on the edge
    getPossibleMoves(pieceInitialCoord: Coordinate): Trie | null {
        const piece = this.state.remainingPieces.get(
            coordToString(pieceInitialCoord)
        );
        if (!piece) {
            return null;
        }

        const possiblePaths = this.dfsIterativelyFindAllPaths(
            pieceInitialCoord,
            piece,
            MAX_MOVES_FOR_DICE_FACE[piece.topFace]
        );

        const trie = new Trie(piece, pieceInitialCoord);
        for (const path of possiblePaths) {
            trie.insert(path.slice(1));
        }
        return trie;
    }

    // IMPROVEMENT: memoization
    // IMPROVEMENT: no need to compute via Coordinate[][]; we can store directly within the TrieNode
    private dfsIterativelyFindAllPaths(
        start: Coordinate,
        piece: Piece,
        maxMoves: number
    ): NodeData[][] {
        const results: NodeData[][] = [];
        const stack: { path: NodeData[]; movesLeft: number }[] = [
            {
                path: [{ coordinate: start, topFace: piece.topFace }],
                movesLeft: maxMoves,
            },
        ];

        while (stack.length > 0) {
            const { path, movesLeft } = stack.pop()!;

            if (movesLeft === 0) {
                results.push([...path]);
                continue;
            }

            for (const [direction, offset] of Object.entries(DIRECTION_MAP)) {
                const nextCoordinate = addCoords(
                    path[path.length - 1].coordinate,
                    offset
                );
                // disallow dice moving back to the previous coordinate
                const isSameAsPreviousCoord =
                    path.length > 1 &&
                    eqCoords(path[path.length - 2].coordinate, nextCoordinate);
                const isOutsideBoard =
                    nextCoordinate.x < 0 ||
                    nextCoordinate.x >= gameSize ||
                    nextCoordinate.y < 0 ||
                    nextCoordinate.y >= gameSize;
                const isOccupied =
                    !eqCoords(start, nextCoordinate) &&
                    this.state.remainingPieces.has(
                        coordToString(nextCoordinate)
                    );
                if (isSameAsPreviousCoord || isOutsideBoard || isOccupied) {
                    continue;
                }
                const nextNode: NodeData = {
                    coordinate: nextCoordinate,
                    topFace: piece.copy().roll(direction as Direction).topFace,
                };
                const newPath = [...path, nextNode];
                stack.push({ path: newPath, movesLeft: movesLeft - 1 });
            }
        }

        return results;
    }
}
