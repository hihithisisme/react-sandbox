import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import {
    getWinningLine,
    isNotAllowedToPlay,
    newGame,
    otherPlayerSign,
} from './game';
import axios, { AxiosResponse } from 'axios';
import { AIResponse } from '../../pages/api/tictactoe/simple-ai';
import BaseTicTacToe from './BaseTicTacToe';

const gameSize = 3;

function AITicTacToe() {
    const isPlayerFirst = true;

    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        const squares = game.squares.slice();
        squares[i] = game.isPlayerTurn
            ? game.playerSign
            : otherPlayerSign(game);
        let nGame = {
            ...game,
            squares,
            isPlayerTurn: !game.isPlayerTurn,
        };
        setGame(nGame);

        const aiMove: number = (
            (await axios.post('/api/tictactoe/simple-ai', {
                data: nGame,
            })) as AxiosResponse<AIResponse>
        ).data.bestMove;

        setTimeout(() => {
            setGame((nGame) => {
                if (getWinningLine(nGame)) {
                    return nGame;
                }

                const squares = nGame.squares.slice();
                squares[aiMove] = nGame.isPlayerTurn
                    ? nGame.playerSign
                    : otherPlayerSign(nGame);
                return {
                    ...nGame,
                    squares,
                    isPlayerTurn: !nGame.isPlayerTurn,
                };
            });
        }, 300);
    }

    const [game, setGame] = useState(newGame(gameSize, isPlayerFirst));

    return (
        <Box textAlign={'center'}>
            <BaseTicTacToe
                handleSquareClick={handleClick}
                game={game}
                setGame={setGame}
                isPlayerFirst={isPlayerFirst}
            />
            <Button
                // variant="contained"
                size="md"
                colorScheme="teal"
                onClick={() => setGame(newGame(gameSize, isPlayerFirst))}
            >
                reset
            </Button>
        </Box>
    );
}

export default AITicTacToe;
