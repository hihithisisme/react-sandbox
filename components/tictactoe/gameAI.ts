import { getWinner, IGame, isMovesLeft, otherPlayerSign } from './game';

export function evaluate(game: IGame): number {
    const winnerSign = getWinner(game);
    if (winnerSign == '') {
        return 0;
    } else if (winnerSign == game.playerSign) {
        return 1;
    } else {
        return -1;
    }
}

export function findBestMove(game: IGame): number {
    let bestScore = game.isPlayerTurn ? -999999 : 999999;
    let bestMove = -1;

    for (let i = 0; i < game.squares.length; i++) {
        if (game.squares[i] !== null) {
            continue;
        }

        const nSq = Array.from(game.squares);
        nSq[i] = game.isPlayerTurn ? game.playerSign : otherPlayerSign(game);
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

    if (game.isPlayerTurn) {
        let maxScore = -99999999;

        for (let i = 0; i < game.squares.length; i++) {
            if (game.squares[i] !== null) {
                continue;
            }

            const nSq = Array.from(game.squares);
            nSq[i] = game.playerSign;
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
            nSq[i] = otherPlayerSign(game);
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
