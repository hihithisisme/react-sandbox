// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    getWinner,
    IGame,
    isMovesLeft,
    otherPlayerSign,
} from '../../../tictactoe/game';

export type AIResponse = {
    bestMove: number;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<AIResponse>
) {
    res.status(200).json({ bestMove: findBestMove(req.body.data) });
}

const DEPTH_THRESHOLD = 5;

function getCurrentSign(game: IGame) {
    return game.isPlayerTurn
        ? game.playerSign
        : otherPlayerSign(game.playerSign);
}

export function evaluate(game: IGame): number {
    const winnerSign = getWinner(game);
    if (winnerSign !== '') {
        // compare against playerSign as playerSign is the 'maximising player'
        return winnerSign == game.playerSign ? 1000 : -1000;
    }

    return 0;
    // const lines = getLines(game);
    // const numOfPossibleLines = lines
    //     .map((line): number => {
    //         return line.some(
    //             (sqIndex) => game.squares[sqIndex] === getOtherSign(game)
    //         )
    //             ? 1
    //             : 0;
    //     })
    //     .reduce((a, b) => a + b);
    //
    // return numOfPossibleLines * getPolaritySign(game);
}

export function findBestMove(game: IGame): number {
    let bestScore = game.isPlayerTurn ? -999999 : 999999;
    let bestMove = -1;

    for (let i = 0; i < game.squares.length; i++) {
        if (game.squares[i] !== null) {
            continue;
        }

        const nSq = Array.from(game.squares);
        nSq[i] = getCurrentSign(game);
        const nGame = {
            ...game,
            squares: nSq,
            isPlayerTurn: !game.isPlayerTurn,
        };

        const score = minmax(nGame, 0);
        if (game.isPlayerTurn) {
            if (score > bestScore) {
                bestMove = i;
                bestScore = score;
            }
        } else {
            if (score < bestScore) {
                bestMove = i;
                bestScore = score;
            }
        }
    }
    return bestMove;
}

function minmax(game: IGame, depth: number) {
    const score = evaluate(game);
    if (score != 0) {
        return score;
    }

    if (!isMovesLeft(game)) {
        return 0;
    }

    if (depth > DEPTH_THRESHOLD) {
        return score;
    }

    if (game.isPlayerTurn) {
        let maxScore = -99999999;

        for (let i = 0; i < game.squares.length; i++) {
            if (game.squares[i] !== null) {
                continue;
            }

            const nSq = Array.from(game.squares);
            nSq[i] = getCurrentSign(game);
            const nGame = {
                ...game,
                squares: nSq,
                isPlayerTurn: !game.isPlayerTurn,
            };

            maxScore = Math.max(maxScore, minmax(nGame, depth + 1));
        }

        return maxScore;
    } else {
        let minScore = 99999999;
        for (let i = 0; i < game.squares.length; i++) {
            if (game.squares[i] !== null) {
                continue;
            }

            const nSq = Array.from(game.squares);
            nSq[i] = getCurrentSign(game);
            const nGame = {
                ...game,
                squares: nSq,
                isPlayerTurn: !game.isPlayerTurn,
            };

            minScore = Math.min(minScore, minmax(nGame, depth + 1));
        }
        return minScore;
    }
}
