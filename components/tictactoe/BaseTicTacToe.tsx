import { Dispatch, SetStateAction } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Blob } from '../Blob';
import Board from './Board';
import { IGame } from '../../tictactoe/game';

const gameSize = 3;
const baseSize = gameSize * 100;
export const boardSize = { base: `${baseSize}px`, md: `${baseSize * 1.5}px` };
export const paddedBoardSize = {
    base: `${baseSize + 50}px`,
    md: `${baseSize * 1.5 + 50}px`,
};
export const squareSize = {
    base: `${baseSize / gameSize}px`,
    md: `${(baseSize * 1.5) / gameSize}px`,
};

export interface BaseTicTacToeProps {
    handleSquareClick(index: number): void;

    game: IGame;
    setGame: Dispatch<SetStateAction<IGame>>;
}

export default function BaseTicTacToe(props: BaseTicTacToeProps) {
    return (
        <Box textAlign={'center'}>
            {/*<StatusHeader squares={game.squares} isXNext={game.isXNext} />*/}
            <Grid
                templateRows={'1fr'}
                alignItems={'center'}
                justifyItems={'center'}
                templateColumns={'1fr'}
                boxSize={paddedBoardSize}
            >
                <GridItem rowStart={1} colStart={1}>
                    <Blob boxSize={'150%'} ml={'-25%'} />
                </GridItem>
                <GridItem
                    justifyItems={'center'}
                    rowStart={1}
                    colStart={1}
                    boxSize={'100%'}
                >
                    <Board
                        {...props.game}
                        handleClick={props.handleSquareClick}
                    />
                </GridItem>
            </Grid>

            {/*<GameOptions gameMode={gameSize} setGameMode={(gameSize: number) => {*/}
            {/*    setGameSize(gameSize);*/}
            {/*    createSquares(gameSize);*/}
            {/*}}/>*/}
        </Box>
    );
}
