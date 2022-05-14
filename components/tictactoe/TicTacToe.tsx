import { Box, Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import Board from './Board';
import { getWinningLine, newGame } from './game';

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
        <Box
            textAlign={'center'}
            // h={0}
            // w={{ base: '100%', md: '600px' }}
            // pb={{ base: '100%', md: '600px' }}
        >
            {/*<StatusHeader squares={game.squares} isXNext={game.isXNext} />*/}
            <Flex
                justifyItems={'center'}
                p={10}
                m={5}
                bgColor={'teal.100'}
                borderRadius={'10px'}
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
