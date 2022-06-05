import { getWinningLine, hasGameStarted, IGame } from '../game';
import { decodeSign } from '../squareSign';

const INITIAL_PIECES = [0, 0, 0];

export interface IStackingGame extends IGame {
    playerRemainingPieces: number[];
    oppRemainingPieces: number[];
}

export function newStackingGame(gameSize: number, isPlayerFirst: boolean, initialPieces: number[]): IStackingGame {
    return {
        squares: Array(gameSize ** 2).fill(null),
        isPlayerTurn: isPlayerFirst,
        playerSign: Math.random() < 0.5 ? 'X' : 'O',
        oppRemainingPieces: [...initialPieces],
        playerRemainingPieces: [...initialPieces],
    };
}

export function emptyStackingGame(): IStackingGame {
    return {
        squares: Array(0),
        isPlayerTurn: true,
        playerSign: 'z',
        playerRemainingPieces: [...INITIAL_PIECES],
        oppRemainingPieces: [...INITIAL_PIECES],
    };
}

export function hasMovesLeft(game: IStackingGame): boolean {
    let largestRelativeSize = game.playerRemainingPieces.length - 1;
    while (largestRelativeSize >= 0) {
        if (game.playerRemainingPieces[largestRelativeSize] > 0) {
            return game.squares.some((value) => {
                if (value === null) return true;
                return decodeSign(value).relativeSize! < largestRelativeSize;
            });
        }
        largestRelativeSize--;
    }

    return false;
}

export function hasGameEnded(game: IStackingGame): boolean {
    return hasGameStarted(game) && (!hasMovesLeft(game) || !!getWinningLine(game));
}
