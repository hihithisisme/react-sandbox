import {
    Button,
    Center,
    Grid,
    GridItem,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Hand, HandFist, HandPeace } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import OnlineRoom, { useOnlineRoom } from '../../../websocket/OnlineRoom';
import {
    Coordinate,
    coordToString,
    DiceFace,
    IGameState,
    newCoord,
    Piece,
    PlayerColor,
} from '../logic/data';
import RpsChessGame from '../logic/game';
import { ICommand, InitCmd } from '../logic/message';
import Trie from '../logic/trie';

const gameSize = 8;
const squareSize = 40;
const boardSize = gameSize * squareSize;

export interface IRpsChess {
    isOnline?: boolean;
}

export default function RpsChess({ isOnline = true }: IRpsChess): JSX.Element {
    const roomState = useOnlineRoom();

    const [displayGameState, setDisplayGameState] = useState(
        RpsChessGame.buildInitialPieces()
    );
    const [gameState, setGameState] = useState<IGameState>({
        remainingPieces: RpsChessGame.buildInitialPieces(),
        currentPlayer: undefined,
    });
    const game = new RpsChessGame({
        ...gameState,
        remainingPieces: displayGameState,
    });
    const [isWhite, setIsWhite] = useState(true);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [path, setPath] = useState<Coordinate[]>([]);

    const possibleMovesTrie: Trie | null = useMemo(() => {
        if (path.length === 0) {
            console.log(`useMemo trie: no initial piece selected`);
            return null;
        }
        const trie = game.getPossibleMoves(path[0]);
        console.log(
            `useMemo trie: ${coordToString(path[0])} | nextMoves: ${
                trie?.root?.toString() || null
            }`
        );
        return trie;
    }, [path.length > 0 ? path[0] : null]);

    function handleNewMessage(message: ICommand): void {
        switch (message.action) {
            case 'INIT': {
                const data = message.data as InitCmd;
                setDisplayGameState(data.gameState.remainingPieces);
                setGameState({ ...data.gameState });
                break;
            }
            case 'MOVE': {
                // const data = message.data as MoveCmd;
                // const squares = game.squares.slice();
                // squares[data.move] = data.playerSign;
                // const nGame = {
                //     ...game,
                //     squares,
                //     isPlayerTurn: !game.isPlayerTurn,
                // };
                // setGame(nGame);
                break;
            }
            default:
                console.log('unrecognisable action:', message);
                return;
        }
    }

    function RenderedSquare(colIndex: number, rowIndex: number): JSX.Element {
        // boardCoordinate corresponds to that in the board state in the backend
        const boardCoordinate = newCoord(colIndex, rowIndex);
        // displayCoordinate helps the frontend renders the board
        // as how normal chess players tend to view coordinates
        const displayCoordinate = getDisplayCoordFromBoardCoord(
            boardCoordinate,
            isWhite
        );
        const maybePiece =
            displayGameState.get(coordToString(boardCoordinate)) || undefined;
        return (
            <Square
                displayCoord={displayCoordinate}
                boardCoord={boardCoordinate}
                payload={{ piece: maybePiece }}
                highlightSign={false}
                handleClick={(boardCoord) => {
                    if (!maybePiece) {
                        setPath([]);
                    } else {
                        setPath([boardCoord]);
                    }
                    console.log(`clicked ${coordToString(boardCoord)}`);
                }}
                key={rowIndex * gameSize + colIndex}
            />
        );
    }

    return (
        <VStack>
            {isOnline && (
                <OnlineRoom
                    handleNewMessage={handleNewMessage}
                    {...roomState}
                />
            )}

            <VStack boxSize={'100%'}>
                <Grid
                    boxSize={boardSize}
                    templateColumns={`repeat(${gameSize}, 1fr)`}
                >
                    {Array.from({ length: gameSize }).map((_, rowIndex) => {
                        return Array.from({ length: gameSize }).map(
                            (_, colIndex) => RenderedSquare(colIndex, rowIndex)
                        );
                    })}
                </Grid>

                {isPlayerTurn ? (
                    <Tag colorScheme={'teal'} variant={'solid'} rounded={'xl'}>
                        <Text>Your Turn</Text>
                    </Tag>
                ) : (
                    <Tag
                        colorScheme={'teal'}
                        variant={'outline'}
                        rounded={'xl'}
                    >
                        <Text>Waiting...</Text>
                    </Tag>
                )}
                <Button
                    onClick={() => {
                        setIsWhite(!isWhite);
                        setIsPlayerTurn(!isPlayerTurn);
                    }}
                >
                    Flip board
                </Button>
            </VStack>
        </VStack>
    );
}

function getDisplayCoordFromBoardCoord(
    boardCoord: Coordinate,
    isWhite: boolean
): Coordinate {
    const [colIndex, rowIndex] = [boardCoord.x, boardCoord.y];
    return isWhite
        ? newCoord(colIndex, gameSize - 1 - rowIndex)
        : newCoord(gameSize - 1 - colIndex, rowIndex);
}

export interface ISquareProps {
    displayCoord: Coordinate;
    boardCoord: Coordinate;
    payload: IDiceProps | null;
    highlightSign: boolean;

    handleClick(boardCoord: Coordinate): void;
}

function Square(props: ISquareProps): JSX.Element {
    const squareSizePx = `${squareSize}px`;

    const clickHandler = () => {
        props.handleClick(props.boardCoord);
    };

    return (
        <GridItem
            onClick={clickHandler}
            boxSize={squareSizePx}
            rowSpan={1}
            colSpan={1}
            rowStart={props.displayCoord.y + 1}
            colStart={props.displayCoord.x + 1}
        >
            <Center
                w={'100%'}
                h={'100%'}
                backgroundColor={getSquareColor(props.boardCoord)}
            >
                <Center position={'absolute'} zIndex={1} h={'2px'}>
                    <Text fontSize={'xs'}>
                        {coordToString(props.boardCoord)}
                    </Text>
                </Center>
                {props.payload && <Dice {...props.payload} />}
            </Center>
        </GridItem>
    );
}

function getSquareColor(boardCoordinate: Coordinate): string {
    if ((boardCoordinate.x + boardCoordinate.y) % 2 === 0) {
        // brown
        return '#B58863';
    }
    // ivory
    return '#F0D9B5';
}

interface IDiceProps {
    piece?: Piece;
    isFocus?: boolean;
}

function Dice(props: IDiceProps): JSX.Element {
    const iconPadding = 4;
    if (!props.piece) {
        return <></>;
    }
    function icon(iconProps: any): JSX.Element {
        switch (props.piece!.getDisplay()) {
            case DiceFace.SCISSOR:
                return <HandPeace {...iconProps} />;
            case DiceFace.ROCK:
                return <HandFist {...iconProps} />;
            case DiceFace.PAPER:
                return <Hand {...iconProps} />;
            default:
                throw new Error('unreachable code');
        }
    }
    return (
        <Center
            bgColor={props.piece.playerColor}
            color={
                props.piece.playerColor === PlayerColor.WHITE
                    ? PlayerColor.BLACK
                    : PlayerColor.WHITE
            }
            rounded={4}
            p={`${iconPadding}px`}
        >
            {icon({
                size: squareSize - iconPadding * 2,
            })}
        </Center>
    );
}
