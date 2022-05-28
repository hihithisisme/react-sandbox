import {
    Center,
    Grid,
    GridItem,
    Spinner,
    Stack,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Blob } from '../Blob';
import Board from './Board';
import { hasGameEnded, hasGameStarted, IGame } from '../../tictactoe/game';
import { PlayerIcon } from './Square';

const gameSize = 3;
const baseSize = gameSize * 100;
export const boardSize = { base: `${baseSize}px`, md: `${baseSize * 1.5}px` };
export const paddedBoardSize = {
    base: `${baseSize + 50}px`,
    md: `${baseSize * 1.5 + 50}px`,
};
export const squareSize = {
    base: `${baseSize / gameSize}px`,
    md: `${(baseSize * 1.5) / gameSize}px`,
};

export interface BaseTicTacToeProps {
    game: IGame;
    // setGame: Dispatch<SetStateAction<IGame>>;
    loadingGame?: boolean;
    loadingText?: string;

    handleSquareClick(index: number): void;
}

function BaseGame(props: {
    game: IGame;
    handleClick: (index: number) => void;
}) {
    return <Board {...props.game} handleClick={props.handleClick} />;
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

export default function BaseTicTacToe(props: BaseTicTacToeProps) {
    const loading = props.loadingGame || false;

    const gameStarted = hasGameStarted(props.game);
    return (
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
                        <BaseGame
                            game={props.game}
                            handleClick={props.handleSquareClick}
                        />
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

            {/*<GameOptions gameMode={gameSize} setGameMode={(gameSize: number) => {*/}
            {/*    setGameSize(gameSize);*/}
            {/*    createSquares(gameSize);*/}
            {/*}}/>*/}
        </VStack>
    );
}
