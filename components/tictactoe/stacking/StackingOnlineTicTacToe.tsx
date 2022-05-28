import { Button, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
    emptyGame,
    hasGameEnded,
    hasGameStarted,
} from '../../../tictactoe/game';
import { ICommand, InitCmd, MoveCmd } from '../../../tictactoe/messages';
import OnlineRoom, { OnlineRoomRefProps } from '../../../websocket/OnlineRoom';
import StackingTicTacToe from './StackingTicTacToe';

function StackingOnlineTicTacToe() {
    const [game, setGame] = useState(emptyGame());
    const roomRef = useRef<OnlineRoomRefProps>(null);

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

            <StackingTicTacToe
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

export default StackingOnlineTicTacToe;
