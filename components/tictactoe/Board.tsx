import { Grid } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { boardSize } from './BaseTicTacToe';
import { getWinningLine, IGame, isMovesLeft } from '../../tictactoe/game';

interface IBoardProps extends IGame {
    handleClick(i: number): void;
}

export default function Board(props: IBoardProps): JSX.Element {
    const gameSize = props.squares.length ** 0.5;

    function shouldHighlightSquare(i: number): boolean {
        if (!isMovesLeft(props)) {
            return false;
        }

        const winningLine = getWinningLine(props);
        if (winningLine) {
            return winningLine.includes(i);
        }

        return true;
    }

    return (
        <Grid
            // id="board"
            // container
            // direction={'column'}
            // h={{ base: '300px', md: '900px' }}
            // w={{ base: '300px', md: '100%' }}
            boxSize={boardSize}
            templateColumns={`repeat(${gameSize}, 1fr)`}
        >
            {props.squares.map((_, i) => (
                <DynamicSquare
                    index={i}
                    gameSize={gameSize}
                    value={props.squares[i]}
                    highlight={shouldHighlightSquare(i)}
                    handleClick={() => props.handleClick(i)}
                    key={i}
                />
            ))}
        </Grid>
    );
}

const DynamicSquare = dynamic(() => import('./Square'), { ssr: false });
