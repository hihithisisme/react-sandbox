import { Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { AIResponse } from '../../pages/api/tictactoe/simpleAI';
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
        (await axios.post('/api/tictactoe/simpleAI', {
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
        <VStack>
            <BaseTicTacToe handleSquareClick={handleClick} game={game} />
            <Button
                size="md"
                colorScheme="teal"
                onClick={() => setGame(newGame(gameSize, isPlayerFirst))}
            >
                new game
            </Button>
        </VStack>
    );
}

export default AITicTacToe;
