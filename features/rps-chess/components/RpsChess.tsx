import { Center, Grid, GridItem, VStack } from '@chakra-ui/react';
import { Hand, HandFist, HandPeace } from '@phosphor-icons/react';
import { useState } from 'react';
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

const gameSize = 8;
const squareSize = 40;
const boardSize = gameSize * squareSize;

export interface IRpsChess {
    isOnline?: boolean;
}

export default function RpsChess({ isOnline = true }: IRpsChess): JSX.Element {
    const [game, setGame] = useState<IGameState>({
        remainingPieces: RpsChessGame.buildInitialPieces(),
        currentPlayer: undefined,
    });
    const roomState = useOnlineRoom();

    function handleNewMessage(message: ICommand): void {
        switch (message.action) {
            case 'INIT': {
                const data = message.data as InitCmd;
                console.log(
                    `pieces in data: ${[
                        ...data.gameState.remainingPieces.entries(),
                    ]}`
                );

                setGame({ ...data.gameState });
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

    return (
        <VStack>
            {isOnline && (
                <OnlineRoom
                    handleNewMessage={handleNewMessage}
                    {...roomState}
                />
            )}

            <Center boxSize={'100%'}>
                <Grid
                    boxSize={boardSize}
                    templateColumns={`repeat(${gameSize}, 1fr)`}
                >
                    {Array.from({ length: gameSize }).map((_, rowIndex) => {
                        return Array.from({ length: gameSize }).map(
                            (_, colIndex) => {
                                {
                                    /* TODO: flip the board if starting first */
                                }
                                const displayCoordinate = newCoord(
                                    colIndex,
                                    rowIndex
                                );
                                const boardCoordinate = newCoord(
                                    colIndex,
                                    rowIndex
                                );
                                const maybePiece =
                                    game.remainingPieces.get(
                                        coordToString(boardCoordinate)
                                    ) || undefined;
                                return (
                                    <Square
                                        displayCoord={displayCoordinate}
                                        boardCoord={boardCoordinate}
                                        payload={{ piece: maybePiece }}
                                        highlightSign={false}
                                        handleClick={() =>
                                            console.log('clicked')
                                        }
                                        key={rowIndex * gameSize + colIndex}
                                    />
                                );
                            }
                        );
                    })}
                </Grid>
            </Center>
        </VStack>
    );
}

export interface ISquareProps {
    displayCoord: Coordinate;
    boardCoord: Coordinate;
    payload: IDiceProps | null;
    highlightSign: boolean;

    handleClick(): void;
}

function Square(props: ISquareProps): JSX.Element {
    const squareSizePx = `${squareSize}px`;

    return (
        <GridItem
            onClick={props.handleClick}
            boxSize={squareSizePx}
            rowSpan={1}
            colSpan={1}
            rowStart={props.displayCoord.y + 1}
            colStart={props.displayCoord.x + 1}
            // border={`1px black solid`}
        >
            <Center
                w={'100%'}
                h={'100%'}
                backgroundColor={getSquareColor(props.boardCoord)}
            >
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
    if (!props.piece) {
        return <></>;
    }
    function icon(iconProps: any): JSX.Element {
        switch (props.piece!.topFace) {
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
            p={'2px'}
        >
            {icon({
                size: squareSize - 12,
            })}
        </Center>
    );
}
