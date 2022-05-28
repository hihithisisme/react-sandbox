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
import { DndContext } from '@dnd-kit/core';
import { PlayerIcon } from '../Square';
import { boardSize, paddedBoardSize } from '../BaseTicTacToe';
import { Blob } from '../../Blob';
import dynamic from 'next/dynamic';
import Draggable from './Draggable';
import Droppable from './Droppable';

export interface StackingTicTacToeProps extends IGame {
    // game: IGame;
    // setGame: Dispatch<SetStateAction<IGame>>;
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

export default function StackingTicTacToe(props: StackingTicTacToeProps) {
    const loading = props.loadingGame || false;

    const gameStarted = hasGameStarted(props);

    return (
        <DndContext>
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
                            sign={props.playerSign}
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

                <HStack>
                    {Array(3)
                        .fill(0)
                        .map((_, index) => {
                            return (
                                <Draggable id={index} key={index}>
                                    <PlayerIcon
                                        sign={`X-${index}`}
                                        isFocus={true}
                                    />
                                </Draggable>
                            );
                        })}
                </HStack>
            </VStack>
        </DndContext>
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
                    <Droppable id={i} key={i}>
                        <DynamicSquare
                            index={i}
                            gameSize={gameSize}
                            signValue={props.squares[i]}
                            highlightSign={shouldHighlightSquare(i)}
                            handleClick={() => {}}
                        />
                    </Droppable>
                ))}
            </Grid>
        </Center>
    );
}

const DynamicSquare = dynamic(() => import('../Square'), { ssr: false });
