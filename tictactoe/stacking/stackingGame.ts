import { IGame } from '../game';

const INITIAL_PIECES = [4, 3, 2];

export interface IStackingGame extends IGame {
    playerRemainingPieces: number[];
    oppRemainingPieces: number[];
}

export function newStackingGame(gameSize: number, isPlayerFirst: boolean): IStackingGame {
    return {
        squares: Array(gameSize ** 2).fill(null),
        isPlayerTurn: isPlayerFirst,
        playerSign: Math.random() < 0.5 ? 'X' : 'O',
        oppRemainingPieces: [...INITIAL_PIECES],
        playerRemainingPieces: [...INITIAL_PIECES],
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
