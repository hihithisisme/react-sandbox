import {
    Center,
    Grid,
    GridItem,
    HStack,
    Spinner,
    Stack,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    getWinningLine,
    hasGameEnded,
    hasGameStarted,
    IGame,
    isMovesLeft,
} from '../../../tictactoe/game';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { PlayerIcon } from '../Square';
import { boardSize, paddedBoardSize } from '../BaseTicTacToe';
import { Blob } from '../../Blob';
import DraggablePiece from './DraggablePiece';
import DroppableSquare from './DroppableSquare';
import { deserializeSign, encodeSign } from '../../../tictactoe/squareSign';
import { IStackingGame } from '../../../tictactoe/stacking/stackingGame';
import { Dispatch, SetStateAction } from 'react';

export interface StackingTicTacToeProps extends IStackingGame {
    setGame: Dispatch<SetStateAction<IStackingGame>>;

    loadingGame?: boolean;
    loadingText?: string;
}

function LoadingGame({ value }: { value: string | undefined }) {
    return (
        <Center boxSize={'100%'}>
            <VStack>
                <Spinner size={'xl'} />
                <Text>{value}</Text>
            </VStack>
        </Center>
    );
}

function handleDragEnd(event: DragEndEvent, props: StackingTicTacToeProps) {
    if (event.over) {
        const dropData = event.over.data.current!;
        const dragData = event.active.data.current!;

        const relativePieceSize: number = dragData.id;
        const playerRemainingPieces = [...props.playerRemainingPieces];
        playerRemainingPieces[relativePieceSize] =
            playerRemainingPieces[relativePieceSize] - 1;

        const squares = props.squares;
        const selectedSquare = squares[dropData.id];
        const existingSign = deserializeSign(selectedSquare);

        // TODO: move this logic to DroppableSquare and BE logic
        if (
            existingSign &&
            existingSign.size < deserializeSign(dragData.signValue)!.size
        ) {
            squares[dropData.id] = dragData.signValue;

            props.setGame({
                ...props,
                playerRemainingPieces,
                squares,
            });
        }
    }
}

export default function StackingTicTacToe(props: StackingTicTacToeProps) {
    const loading = props.loadingGame || false;

    const gameStarted = hasGameStarted(props);

    return (
        <DndContext
            id={'dndcontext'}
            onDragEnd={(event: DragEndEvent) => handleDragEnd(event, props)}
        >
            <VStack width={'100%'}>
                <Grid
                    templateRows={'1fr'}
                    templateColumns={'1fr'}
                    boxSize={paddedBoardSize}
                >
                    <GridItem rowStart={1} colStart={1}>
                        <Blob />
                    </GridItem>
                    <GridItem rowStart={1} colStart={1}>
                        {loading ? (
                            <LoadingGame value={props.loadingText} />
                        ) : (
                            <StackingGame {...props} />
                        )}
                    </GridItem>
                </Grid>

                {gameStarted && (
                    <Stack
                        direction={'row'}
                        w={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Text>You are: </Text>
                        <PlayerIcon
                            signValue={props.playerSign}
                            isFocus={true}
                            boxSize={'1rem'}
                        />
                    </Stack>
                )}

                {gameStarted && props.isPlayerTurn && !hasGameEnded(props) && (
                    <Tag colorScheme={'teal'} size={'lg'} variant={'solid'}>
                        Your Turn!
                    </Tag>
                )}

                <RemainingPieces {...props} />
            </VStack>
        </DndContext>
    );
}

function RemainingPieces(props: IStackingGame) {
    const arr3 = Array(3).fill(0);
    return (
        <>
            <Text>Remaining Pieces</Text>
            <HStack w={'100%'} px={6}>
                <VStack alignItems={'start'} flex={1}>
                    {arr3.map((_, index) => (
                        <HStack alignItems={'center'} spacing={2} key={index}>
                            <Text>{props.playerRemainingPieces[index]}</Text>
                            <DraggablePiece
                                id={index}
                                signValue={encodeSign('X', index)}
                                isFocus={true}
                                boxSize={`${index * 10 + 20}px`}
                            />
                        </HStack>
                    ))}
                </VStack>

                <VStack alignItems={'end'} flex={1}>
                    {arr3.map((_, index) => (
                        <HStack alignItems={'center'} spacing={2} key={index}>
                            <PlayerIcon
                                signValue={encodeSign('O', index)}
                                isFocus={true}
                                boxSize={`${index * 10 + 20}px`} //TODO: refactor this hardcoding boxSize
                            />
                            <Text>{props.oppRemainingPieces[index]}</Text>
                        </HStack>
                    ))}
                </VStack>
            </HStack>
        </>
    );
}

function StackingGame(props: IGame) {
    const gameSize = props.squares.length ** 0.5;

    function shouldHighlightSquare(i: number): boolean {
        if (!isMovesLeft(props)) {
            return false;
        }

        const winningLine = getWinningLine(props);
        if (winningLine) {
            return winningLine.includes(i);
        }

        return true;
    }

    return (
        <Center boxSize={'100%'}>
            <Grid
                boxSize={boardSize}
                templateColumns={`repeat(${gameSize}, 1fr)`}
            >
                {props.squares.map((_, i) => (
                    <DroppableSquare
                        key={i}
                        id={i}
                        index={i}
                        gameSize={gameSize}
                        signValue={props.squares[i]}
                        highlightSign={shouldHighlightSquare(i)}
                        handleClick={() => {}}
                    />
                ))}
            </Grid>
        </Center>
    );
}
