import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { AIResponse } from '../../pages/api/tictactoe/simple-ai';
import BaseTicTacToe from './BaseTicTacToe';
import {
    getWinningLine,
    IGame,
    isNotAllowedToPlay,
    newGame,
    otherPlayerSign,
} from '../../tictactoe/game';

const gameSize = 3;

async function getAIBestMove(game: IGame): Promise<number> {
    return (
        (await axios.post('/api/tictactoe/simple-ai', {
            data: game,
        })) as AxiosResponse<AIResponse>
    ).data.bestMove;
}

function AITicTacToe() {
    const isPlayerFirst = true;
    const [game, setGame] = useState(newGame(gameSize, isPlayerFirst));

    async function aiMakeMove(game: IGame) {
        const aiMove: number = await getAIBestMove(game);
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
        await aiMakeMove(nGame);
    }

    return (
        <Box textAlign={'center'}>
            <BaseTicTacToe
                handleSquareClick={handleClick}
                game={game}
                setGame={setGame}
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
