import { Center, Grid } from '@chakra-ui/react';
import { boardSize } from './BaseTicTacToe';
import { getWinningLine, IGame, isMovesLeft } from '../logic/game';
import Square from './Square';

interface IBoardProps extends IGame {
    handleClick(i: number): void;
}

export default function Board(props: IBoardProps): JSX.Element {
    const gameSize = props.squares.length ** 0.5;

    function shouldHighlightSquare(i: number): boolean {
        const winningLine = getWinningLine(props);
        if (winningLine) {
            return winningLine.includes(i);
        }

        return isMovesLeft(props);
    }

    return (
        <Center boxSize={'100%'}>
            <Grid boxSize={boardSize} templateColumns={`repeat(${gameSize}, 1fr)`}>
                {props.squares.map((_, i) => (
                    <Square
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
