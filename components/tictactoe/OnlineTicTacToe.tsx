import { Button, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
    emptyGame,
    hasGameEnded,
    hasGameStarted,
    isNotAllowedToPlay,
    otherPlayerSign,
} from '../../tictactoe/game';
import BaseTicTacToe from './BaseTicTacToe';
import { ICommand, InitCmd, MoveCmd } from '../../tictactoe/commands';
import OnlineRoom, { OnlineRoomRefProps } from '../../websocket/OnlineRoom';

function OnlineTicTacToe() {
    const [game, setGame] = useState(emptyGame());
    const roomRef = useRef<OnlineRoomRefProps>(null);

    async function handleClick(i: number) {
        if (isNotAllowedToPlay(game, i)) {
            return;
        }

        roomRef.current!.sendWsMessage({
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
        // console.log('handling new message', message);

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
            <OnlineRoom ref={roomRef} handleNewMessage={handleNewMessage} />

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
                        roomRef.current!.sendWsMessage({
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

export default OnlineTicTacToe;
