import { Box, Button, Grid, GridItem } from '@chakra-ui/react';
import { useState } from 'react';
import Board from './Board';
import { isNotAllowedToPlay, newGame, otherPlayerSign } from './game';
import { Blob } from '../Blob';

const baseSize = 300;
export const boardSize = { base: `${baseSize}px`, md: `${baseSize * 1.5}px` };
export const paddedBoardSize = {
    base: `${baseSize + 50}px`,
    md: `${baseSize * 1.5 + 50}px`,
};
export const squareSize = {
    base: `${baseSize / 3}px`,
    md: `${(baseSize * 1.5) / 3}px`,
};

function TicTacToe() {
    // const [gameSize, setGameSize] = useState(gameModes[0].value);
    const isPlayerFirst = true;
    const gameSize = 3;

    const [game, setGame] = useState(newGame(gameSize, isPlayerFirst));

    function handleClick(i: number): void {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        const squares = game.squares.slice();
        squares[i] = game.isPlayerNext
            ? game.playerSign
            : otherPlayerSign(game);
        setGame({
            ...game,
            squares,
            isPlayerNext: !game.isPlayerNext,
        });
    }

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
                        {...game}
                        handleClick={(i: number) => handleClick(i)}
                    />
                </GridItem>
            </Grid>

            <Button
                // variant="contained"
                size="md"
                colorScheme="teal"
                onClick={() => setGame(newGame(gameSize, isPlayerFirst))}
            >
                reset
            </Button>

            {/*<GameOptions gameMode={gameSize} setGameMode={(gameSize: number) => {*/}
            {/*    setGameSize(gameSize);*/}
            {/*    createSquares(gameSize);*/}
            {/*}}/>*/}
        </Box>
    );
}

export default TicTacToe;
