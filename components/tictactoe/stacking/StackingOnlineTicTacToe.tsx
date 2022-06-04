import { Button, useToast, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { hasGameEnded, hasGameStarted } from '../../../tictactoe/game';
import { ICommand, InitCmd, MoveCmd } from '../../../tictactoe/stacking/messages';
import OnlineRoom, { OnlineRoomRefProps } from '../../../websocket/OnlineRoom';
import StackingTicTacToe from './StackingTicTacToe';
import { emptyStackingGame, IStackingGame } from '../../../tictactoe/stacking/stackingGame';
import { DragEndEvent } from '@dnd-kit/core';
import { deserializeSign } from '../../../tictactoe/squareSign';

function StackingOnlineTicTacToe() {
    const [game, setGame] = useState(emptyStackingGame());
    const roomRef = useRef<OnlineRoomRefProps>(null);
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
                console.log('setting move', dragData.signValue);
                playerRemainingPieces[relativePieceSize] = playerRemainingPieces[relativePieceSize] - 1;

                roomRef.current!.sendWsMessage({
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
        console.log('handling new message', message);

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
            <OnlineRoom ref={roomRef} handleNewMessage={handleNewMessage} />

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
