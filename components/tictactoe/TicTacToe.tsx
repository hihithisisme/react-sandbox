import { Box, Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import Board from './Board';
import { getWinningLine, newGame } from './game';

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
        const squares = game.squares.slice();
        if (squares[i] || getWinningLine(game)) {
            return;
        }

        squares[i] = game.isPlayerNext ? 'X' : 'O';
        setGame({
            squares,
            isPlayerNext: !game.isPlayerNext,
        });
    }

    return (
        <Box textAlign={'center'} boxSize={paddedBoardSize}>
            {/*<StatusHeader squares={game.squares} isXNext={game.isXNext} />*/}
            <Flex
                justifyItems={'center'}
                p={6}
                m={3}
                bgColor={'teal.100'}
                borderRadius={'10px'}
                boxSize={'100%'}
            >
                <Board {...game} handleClick={(i: number) => handleClick(i)} />
            </Flex>

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
