export interface IGame {
    squares: Array<string | null>;
    isPlayerNext: boolean;
}

export function newGame(gameSize: number, isPlayerFirst: boolean): IGame {
    return {
        squares: Array(gameSize ** 2).fill(null),
        isPlayerNext: isPlayerFirst,
    };
}

function getLines(game: IGame): number[][] {
    const size = game.squares.length ** 0.5;

    const verticalIndices: number[][] = Array(size)
        .fill([0])
        .map(() => []);
    const horizontalIndices: number[][] = Array(size)
        .fill([0])
        .map(() => []);
    const diagonalIndices: number[][] = Array(2)
        .fill([0])
        .map(() => []);

    for (let i = 0; i < game.squares.length; i++) {
        const v = i % size;
        const h = ~~(i / size); // floor division. note: only value for positive numbers
        const d0 =
            i % (size - 1) === 0 && i !== 0 && i !== game.squares.length - 1; // checks if belongs to topright-bottomleft diagonal
        const d1 = i % (size + 1) === 0; // checks if belongs to topleft-bottomright diagonal

        verticalIndices[v].push(i);
        horizontalIndices[h].push(i);
        if (d0) {
            diagonalIndices[0].push(i);
        }
        if (d1) {
            diagonalIndices[1].push(i);
        }
    }
    return verticalIndices.concat(horizontalIndices, diagonalIndices);
}

export function getWinningLine(game: IGame): number[] | null {
    const lines = getLines(game);

    for (const line of lines) {
        const firstVal = game.squares[line[0]];
        if (!firstVal) {
            continue;
        }

        const someoneWon = line.every(
            (value) => game.squares[value] == firstVal
        );
        if (someoneWon) {
            return line;
        }
    }
    return null;
}

export function getWinner(game: IGame): string {
    const winningLine = getWinningLine(game);
    if (winningLine == null) {
        return '';
    }
    return game.squares[winningLine[0]]!;
}

export function evaluate(game: IGame, playerSign: string): number {
    const winnerSign = getWinner(game);
    if (winnerSign == '') {
        return 0;
    } else if (winnerSign == playerSign) {
        return 1;
    } else {
        return -1;
    }
}
