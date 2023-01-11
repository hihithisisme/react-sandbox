import { Button, useToast, VStack } from '@chakra-ui/react';
import { DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import OnlineRoom, { useOnlineRoom } from '../../../../websocket/OnlineRoom';
import { hasGameEnded, hasGameStarted } from '../../logic/game';
import { deserializeSign } from '../../logic/squareSign';
import { ICommand, InitCmd, MoveCmd } from '../logic/messages';
import { emptyStackingGame, IStackingGame } from '../logic/stackingGame';
import StackingTicTacToe from './StackingTicTacToe';

function StackingOnlineTicTacToe() {
    const [game, setGame] = useState(emptyStackingGame());
    const roomState = useOnlineRoom();
    const toast = useToast();

    function handleDragEnd(event: DragEndEvent, props: IStackingGame) {
        if (event.over) {
            const dropData = event.over.data.current!;
            const dragData = event.active.data.current!;

            if (!props.isPlayerTurn) {
                toast({
                    title: 'Sorry, not your turn yet',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });

                return;
            }

            const relativePieceSize: number = dragData.id;
            const playerRemainingPieces = [...props.playerRemainingPieces];
            if (playerRemainingPieces[relativePieceSize] <= 0) {
                return;
            }

            const squares = props.squares;
            const selectedSquare = squares[dropData.id];
            const existingSign = deserializeSign(selectedSquare);

            // TODO: move this logic to DroppableSquare and BE logic
            if (!existingSign || existingSign.size < deserializeSign(dragData.signValue)!.size) {
                // console.log('setting move', dragData.signValue);
                playerRemainingPieces[relativePieceSize] = playerRemainingPieces[relativePieceSize] - 1;

                roomState.sendWsMessage({
                    action: 'MOVE',
                    data: {
                        move: dropData.id,
                        playerSign: dragData.signValue,
                        playerRemainingPieces: playerRemainingPieces,
                        oppRemainingPieces: props.oppRemainingPieces,
                    } as MoveCmd,
                });
            }
        }
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
                    playerRemainingPieces: data.playerRemainingPieces,
                    oppRemainingPieces: data.oppRemainingPieces,
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
                    playerRemainingPieces: data.playerRemainingPieces,
                    oppRemainingPieces: data.oppRemainingPieces,
                } as IStackingGame;
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

            <StackingTicTacToe
                setGame={setGame}
                handleDragEnd={handleDragEnd}
                {...game}
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

export default StackingOnlineTicTacToe;
