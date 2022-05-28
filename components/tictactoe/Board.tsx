import { Center, Grid } from '@chakra-ui/react';
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
        <Center boxSize={'100%'}>
            <Grid
                boxSize={boardSize}
                templateColumns={`repeat(${gameSize}, 1fr)`}
            >
                {props.squares.map((_, i) => (
                    <DynamicSquare
                        index={i}
                        gameSize={gameSize}
                        signValue={props.squares[i]}
                        highlightSign={shouldHighlightSquare(i)}
                        handleClick={() => props.handleClick(i)}
                        key={i}
                    />
                ))}
            </Grid>
        </Center>
    );
}

const DynamicSquare = dynamic(() => import('./Square'), { ssr: false });
