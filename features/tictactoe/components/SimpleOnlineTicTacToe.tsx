import { Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import {
    emptyGame,
    hasGameEnded,
    hasGameStarted,
    isNotAllowedToPlay,
    otherPlayerSign,
} from '../logic/game';
import BaseTicTacToe from './BaseTicTacToe';
import { ICommand, InitCmd, MoveCmd } from '../logic/messages';
import OnlineRoom, { useOnlineRoom } from '../../../websocket/OnlineRoom';

function SimpleOnlineTicTacToe() {
    const [game, setGame] = useState(emptyGame());
    const roomState = useOnlineRoom();

    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        roomState.sendWsMessage({
            action: 'MOVE',
            data: {
                move: i,
                playerSign: game.isPlayerTurn
                    ? game.playerSign
                    : otherPlayerSign(game.playerSign),
            },
        });
    }

    function handleNewMessage(message: ICommand): void {
        switch (message.action) {
            case 'INIT': {
                const data = message.data as InitCmd;
                setGame({
                    isPlayerTurn: data.playerTurn,
                    playerSign: data.playerSign,
                    squares: data.squares,
                });
                break;
            }
            case 'MOVE': {
                const data = message.data as MoveCmd;
                const squares = game.squares.slice();
                squares[data.move] = data.playerSign;
                const nGame = {
                    ...game,
                    squares,
                    isPlayerTurn: !game.isPlayerTurn,
                };
                setGame(nGame);
                break;
            }
            default:
                console.log('unrecognisable action:', message);
                return;
        }
    }

    return (
        <VStack>
            <OnlineRoom handleNewMessage={handleNewMessage} {...roomState} />

            <BaseTicTacToe
                handleSquareClick={handleClick}
                game={game}
                loadingGame={!hasGameStarted(game)}
                loadingText={'Waiting for other player to connect'}
            />

            {hasGameEnded(game) && (
                <Button
                    size="md"
                    colorScheme="teal"
                    variant={'outline'}
                    onClick={() => {
                        roomState.sendWsMessage({
                            action: 'RESET',
                            data: {},
                        });
                    }}
                >
                    new game
                </Button>
            )}
        </VStack>
    );
}

export default SimpleOnlineTicTacToe;
