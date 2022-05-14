import { Grid } from '@chakra-ui/react';
import { getWinningLine, IGame } from './game';
import dynamic from 'next/dynamic';

export default function Board(props: IBoardProps): JSX.Element {
    const gameSize = props.squares.length ** 0.5;
    const winningLine = getWinningLine(props);
    if (winningLine) {
        console.log(winningLine);
    }

    // const renderRow = () => {
    //     const squareRow = Array(props.game.size)
    //         .fill(0)
    //         .map(() => {
    //             const sq = renderSquare(index);
    //             index++;
    //             return sq;
    //         });
    //
    //     return (
    //         <Grid container item justifyContent={'center'} wrap={'nowrap'}>
    //             {squareRow}
    //         </Grid>
    //     );
    // };
    //
    // const rows = Array(props.gameSize)
    //     .fill(0)
    //     .map(() => renderRow());

    return (
        // TODO: make size dynamic
        <Grid
            // id="board"
            // container
            // direction={'column'}
            // h={{ base: '300px', md: '900px' }}
            // w={{ base: '300px', md: '100%' }}
            h={'300px'}
            w={'300px'}
            templateRows={`repeat(${gameSize}, 1fr)`}
            templateColumns={`repeat(${gameSize}, 1fr)`}
            autoRows={'minmax(min-content, max-content)'}
            autoColumns={'minmax(min-content, max-content)'}
        >
            {props.squares.map((_, i) => (
                <DynamicSquare
                    index={i}
                    gameSize={gameSize}
                    value={props.squares[i]}
                    highlight={winningLine ? winningLine.includes(i) : true}
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
