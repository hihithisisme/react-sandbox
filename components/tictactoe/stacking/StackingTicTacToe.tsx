import {
    Center,
    Flex,
    Grid,
    GridItem,
    HStack,
    Spinner,
    Stack,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Blob } from '../../Blob';
import Board from '../Board';
import { hasGameEnded, hasGameStarted, IGame } from '../../../tictactoe/game';
import { PlayerIcon } from '../Square';
import { paddedBoardSize } from '../BaseTicTacToe';

export interface StackingTicTacToeProps {
    game: IGame;
    // setGame: Dispatch<SetStateAction<IGame>>;
    loadingGame?: boolean;
    loadingText?: string;
}

function StackingGame(props: { game: IGame }) {
    return <Board {...props.game} handleClick={() => {}} />;
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

    const gameStarted = hasGameStarted(props.game);
    return (
        <VStack width={'100%'}>
            <Flex>{props.game.isPlayerTurn}</Flex>
            <Grid
                templateRows={'1fr'}
                templateColumns={'1fr'}
                boxSize={paddedBoardSize}
            >
                <GridItem rowStart={1} colStart={1}>
                    <Blob boxSize={'100%'} />
                </GridItem>
                <GridItem rowStart={1} colStart={1}>
                    {loading ? (
                        <LoadingGame value={props.loadingText} />
                    ) : (
                        <StackingGame game={props.game} />
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
                        sign={props.game.playerSign}
                        isFocus={true}
                        boxSize={'1rem'}
                    />
                </Stack>
            )}

            {gameStarted &&
                props.game.isPlayerTurn &&
                !hasGameEnded(props.game) && (
                    <Tag colorScheme={'teal'} size={'lg'} variant={'solid'}>
                        Your Turn!
                    </Tag>
                )}

            <HStack>
                {Array(3)
                    .fill(0)
                    .map((_, index) => {
                        return (
                            <PlayerIcon
                                sign={`X-${index}`}
                                isFocus={true}
                                key={index}
                            />
                        );
                    })}
            </HStack>
        </VStack>
    );
}
