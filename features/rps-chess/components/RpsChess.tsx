import { Center, Grid, GridItem, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import OnlineRoom, { useOnlineRoom } from '../../../websocket/OnlineRoom';
import {
    Coordinate,
    coordToString,
    IGameState,
    newCoord,
    Piece,
} from '../logic/data';
import { ICommand, InitCmd } from '../logic/message';

const gameSize = 8;
const baseSize = gameSize * 100;
const boardSize = { base: `${baseSize}px`, md: `${baseSize * 1.5}px` };

export default function RpsChess(): JSX.Element {
    const [game, setGame] = useState<IGameState>({
        remainingPieces: new Map<string, Piece>(),
        currentPlayerId: undefined,
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
            <OnlineRoom handleNewMessage={handleNewMessage} {...roomState} />

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
                                    ) || null;
                                console.log(
                                    `maybePiece: ${maybePiece}, boardCoordinate: ${boardCoordinate}, pieces: ${[
                                        ...Array.from(
                                            game.remainingPieces.keys()
                                        ).map((coord) => `[${coord}]`),
                                    ]}`
                                );
                                return (
                                    <Square
                                        displayCoord={displayCoordinate}
                                        boardCoord={boardCoordinate}
                                        payload={maybePiece}
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
    payload: any | null;
    highlightSign: boolean;

    handleClick(): void;
}

function Square(props: ISquareProps): JSX.Element {
    const squareSize = {
        base: `${baseSize / gameSize}px`,
        md: `${(baseSize * 1.5) / gameSize}px`,
    };

    return (
        <GridItem
            onClick={props.handleClick}
            boxSize={squareSize}
            rowSpan={1}
            colSpan={1}
            rowStart={props.displayCoord.y + 1}
            colStart={props.displayCoord.x + 1}
            border={`2px black solid`}
        >
            <Center
                w={'100%'}
                h={'100%'}
                backgroundColor={getSquareColor(props.boardCoord)}
            >
                {props.payload && (
                    <Dice face={props.payload} isFocus={props.highlightSign} />
                )}
            </Center>
        </GridItem>
    );
}

function getSquareColor(boardCoordinate: Coordinate): string {
    if ((boardCoordinate.x + boardCoordinate.y) % 2 === 0) {
        return 'black';
    }
    return 'white';
}

enum DiceFace {
    Rock = 'rock',
    Paper = 'paper',
    Scissor = 'scissor',
}

interface IDiceProps {
    face: DiceFace;
    isFocus: boolean;
}

function Dice(props: IDiceProps): JSX.Element {
    return <Center>Hello</Center>;
}
