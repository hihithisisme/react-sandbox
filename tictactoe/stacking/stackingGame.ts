import { IGame } from '../game';

export interface IStackingGame extends IGame {
    playerRemainingPieces: number[];
    oppRemainingPieces: number[];
}

export function emptyStackingGame(): IStackingGame {
    return {
        squares: Array(0),
        isPlayerTurn: true,
        playerSign: 'z',
        playerRemainingPieces: [4, 3, 2],
        oppRemainingPieces: [4, 3, 2],
    };
}
