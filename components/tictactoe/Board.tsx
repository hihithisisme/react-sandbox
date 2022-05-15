import { Grid } from '@chakra-ui/react';
import { getWinningLine, IGame, isEndOfGame } from './game';
import dynamic from 'next/dynamic';
import { boardSize } from './TicTacToe';

export default function Board(props: IBoardProps): JSX.Element {
    const gameSize = props.squares.length ** 0.5;

    function shouldHighlightSquare(i: number): boolean {
        if (isEndOfGame(props)) {
            const winningLine = getWinningLine(props);
            if (winningLine) {
                return winningLine.includes(i);
            } else {
                return false;
            }
        }

        return true;
    }

    return (
        // TODO: make size dynamic
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

interface IBoardProps extends IGame {
    handleClick(i: number): void;
}

const DynamicSquare = dynamic(() => import('./Square'), { ssr: false });
