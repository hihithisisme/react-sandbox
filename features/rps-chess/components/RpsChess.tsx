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
import { useEffect, useMemo, useState } from 'react';
import OnlineRoom, { useOnlineRoom } from '../../../websocket/OnlineRoom';
import {
    Coordinate,
    coordToString,
    DiceFace,
    IGameState,
    newCoord,
    PlayerColor,
    stringToCoord,
} from '../logic/data';
import RpsChessGame from '../logic/game';
import { ICommand, InitCmd } from '../logic/message';
import Trie, { NodeData } from '../logic/trie';

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
    const [path, setPath] = useState<NodeData[]>([]);
    const selectedCoordString =
        path.length > 0 ? coordToString(path[0].coordinate) : undefined;

    // IMPROVEMENT:? condense possibleMovesTrie into nextMovesTrie?
    const possibleMovesTrie: Trie | null = useMemo(() => {
        if (path.length === 0) {
            return null;
        }
        const trie = game.getPossibleMoves(path[0].coordinate);
        console.log(
            `useMemo trie: ${coordToString(path[0].coordinate)} | nextMoves: ${
                trie?.root || null
            }`
        );
        return trie;
    }, [selectedCoordString]);

    const nextMovesTrie: Map<string, NodeData> | null = useMemo(() => {
        if (!possibleMovesTrie) {
            return null;
        }
        const node = possibleMovesTrie.getPointerToPrefixNode(
            path.slice(1).map((d) => d.coordinate)
        );
        console.log(
            `useMemo nextMoves checks: ${JSON.stringify(path)} | ${node}`
        );
        if (!node) {
            return null;
        }

        const data = new Map<string, NodeData>(
            Array.from(node.children.entries()).map(
                ([coordinate, trieNode]) => [
                    coordinate,
                    {
                        coordinate: stringToCoord(coordinate),
                        topFace: trieNode.payload.topFace,
                    } as NodeData,
                ]
            )
        );
        console.log(
            `useMemo nextMoves: ${selectedCoordString} | nextMoves: ${
                Array.from(data).map(([c, d]) => `${c}${d.topFace}`) || null
            }`
        );
        return data;
    }, [possibleMovesTrie, path]);

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

    // TODO: !!! revert to a workable middleground. Then rewrite everything to remove classes within FE interfaces.
    const RenderedSquare = (colIndex: number, rowIndex: number) => {
        // boardCoordinate corresponds to that in the board state in the backend
        const boardCoordinate = newCoord(colIndex, rowIndex);
        const boardCoordStr = coordToString(boardCoordinate);
        // displayCoordinate helps the frontend renders the board
        // as how normal chess players tend to view coordinates
        const displayCoordinate = getDisplayCoordFromBoardCoord(
            boardCoordinate,
            isWhite
        );
        const maybePiece = displayGameState.get(boardCoordStr);
        const hasPiece = !!maybePiece;
        const maybeNextMoveFace = nextMovesTrie?.get(boardCoordStr);
        const isPossibleNextMove = !!maybeNextMoveFace;
        const isInPath = path
            .map((c) => coordToString(c.coordinate))
            .includes(boardCoordStr);
        const colorOfSelectedPiece = !!selectedCoordString
            ? gameState.remainingPieces.get(selectedCoordString)?.playerColor
            : undefined;
        // const overallMaybeDiceFace = hasPiece
        //     ? maybePiece.topFace
        //     : maybeNextMoveFace?.topFace;
        // const overallMaybeDiceFace = hasPiece
        //     ? maybePiece.topFace
        //     : isPossibleNextMove
        //     ? DiceFace.ROCK
        //     : boardCoordStr == '(5,1)'
        //     ? DiceFace.PAPER
        //     : undefined;
        let overallMaybeDiceFace = maybePiece?.topFace;
        if (!hasPiece && isPossibleNextMove) {
            overallMaybeDiceFace = DiceFace.ROCK;
        } else if (boardCoordStr == '(5,1)') {
            overallMaybeDiceFace = DiceFace.PAPER;
        }

        const clickHandler = (boardCoord: Coordinate) => {
            // TODO: set the state for rolling the dice here
            setPath((v) => {
                v.push({
                    coordinate: boardCoord,
                    topFace:
                        gameState.remainingPieces.get(coordToString(boardCoord))
                            ?.topFace ||
                        gameState.remainingPieces.get(selectedCoordString!)!
                            .topFace,
                });
                return [...v];
            });
            console.log(`clicked ${coordToString(boardCoord)}`);
            // if (!maybePiece) {
            //     setPath([]);
            // } else {
            //     setPath([boardCoord]);
            // }
        };

        const payload = {
            diceFace: overallMaybeDiceFace,
            playerColor: hasPiece
                ? maybePiece.playerColor
                : colorOfSelectedPiece,
            variant: hasPiece
                ? 'solid'
                : maybeNextMoveFace
                ? 'ghost'
                : undefined,
        } as IDiceProps;
        if (boardCoordStr == '(5,1)') {
            console.log(
                `(5,1): ${hasPiece}, ${isPossibleNextMove}, ${
                    maybeNextMoveFace?.topFace
                }, ${overallMaybeDiceFace}, ${JSON.stringify(payload)}`
            );
        }

        return (
            <Square
                {...payload}
                diceFace={overallMaybeDiceFace}
                displayCoord={displayCoordinate}
                boardCoord={boardCoordinate}
                backgroundColor={getSquareBgColor(
                    boardCoordinate,
                    isInPath,
                    isPossibleNextMove
                )}
                handleClick={clickHandler}
                key={rowIndex * gameSize + colIndex}
            />
        );
    };

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

export interface ISquareProps extends IDiceProps {
    displayCoord: Coordinate;
    boardCoord: Coordinate;
    // payload: IDiceProps | null;
    backgroundColor: string;

    handleClick(boardCoord: Coordinate): void;
}

function Square(props: ISquareProps): JSX.Element {
    const squareSizePx = `${squareSize}px`;

    const clickHandler = () => {
        props.handleClick(props.boardCoord);
    };

    useEffect(() => {
        if (coordToString(props.boardCoord) == '(5,1)') {
            console.log(
                `inside square: ${props.backgroundColor}, ${
                    props.diceFace
                }, ${JSON.stringify(props)}`
            );
        }
    }, [props]);

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
                backgroundColor={props.backgroundColor}
            >
                <Center position={'absolute'} zIndex={1} h={'2px'}>
                    <Text fontSize={'xs'}>
                        {coordToString(props.boardCoord)}
                    </Text>
                </Center>
                {props.diceFace && <Dice {...props} />}
            </Center>
        </GridItem>
    );
}

function getSquareBgColor(
    boardCoordinate: Coordinate,
    isInPath: boolean,
    isPossibleNextMove: boolean
): string {
    if (isPossibleNextMove) {
        // golden yellow
        return '#FFD700';
    }
    if (isInPath) {
        // light blue
        return '#90CAF9';
    }
    if ((boardCoordinate.x + boardCoordinate.y) % 2 === 0) {
        // brown
        return '#B58863';
    }
    // ivory
    return '#F0D9B5';
}

interface IDiceProps {
    variant?: 'solid' | 'ghost';
    diceFace?: DiceFace;
    playerColor?: PlayerColor;
    isFocus?: boolean;
}

function Dice({
    diceFace,
    playerColor,
    variant = 'solid',
}: IDiceProps): JSX.Element {
    const iconPadding = 4;
    if (!diceFace) {
        return <></>;
    }
    function icon(iconProps: any): JSX.Element {
        switch (diceFace) {
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
    let bgColor: string | undefined = playerColor;
    if (variant === 'ghost') {
        bgColor = playerColor === PlayerColor.WHITE ? 'gray.300' : 'gray.600';
    }
    return (
        <Center
            bgColor={bgColor}
            color={
                playerColor === PlayerColor.WHITE
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
