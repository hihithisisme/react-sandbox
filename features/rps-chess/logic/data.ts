import { Player } from '../../../websocket/room';

export interface IRpsChessGame {
    gameState: IGameState;
    gameSettings: IGameSettings;
    players: Player[];
    // do I need the room state in here?
}

export interface IGameState {
    // represents the mapping of squares which are occupied to tthe Piece occupying the square
    remainingPieces: Map<string, Piece>;
    currentPlayer?: PlayerColor;
}

export interface IGameSettings {
    firstPlayerId: string;
    playerIdToDisplayColor: Map<string, PlayerColor>;
}

export enum PlayerColor {
    WHITE = 'gray.100',
    BLACK = 'gray.700',
}

export interface Coordinate {
    // col
    x: number;
    // row
    y: number;
}

export function newCoord(col: number, row: number): Coordinate {
    return { x: col, y: row };
}

export function coordToString(coord: Coordinate): string {
    return `(${coord.x},${coord.y})`;
}

export function toCoordString(col: number, row: number): string {
    return `(${col},${row})`;
}

export function stringToCoord(str: string): Coordinate {
    const [x, y] = str.substring(1, str.length - 1).split(',');
    return newCoord(parseInt(x), parseInt(y));
}

// Going around in a circle,
// to the right order is: SCISSOR -> PAPER -> SCISSOR
// to the top order is: SCISSOR -> ROCK -> SCISSOR
// to the right order is: ROCK -> PAPER -> ROCK
// to the top order is: ROCK -> SCISSOR -> ROCK
export enum DiceFace {
    ROCK = '🪨',
    PAPER = '📄',
    SCISSOR = '✂️',
}

export class Piece {
    id: string;
    playerColor: PlayerColor;
    topFace: DiceFace;
    colFace: DiceFace;
    rowFace: DiceFace;

    constructor(
        id: string,
        playerColor: PlayerColor,
        topFace: DiceFace,
        colFace: DiceFace,
        rowFace: DiceFace
    ) {
        this.id = id;
        this.playerColor = playerColor;
        this.topFace = topFace;
        this.colFace = colFace;
        this.rowFace = rowFace;
    }

    serialize(): string {
        const obj: Record<string, any> = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                obj[key] = this[key];
            }
        }
        return JSON.stringify(obj);
    }

    static deserialize(s: string): Piece {
        const obj = JSON.parse(s);
        return new Piece(
            obj.id,
            obj.playerId,
            obj.topFace,
            obj.colFace,
            obj.rowFace
        );
    }

    static buildInitialScissorDice(id: string, playerColor: PlayerColor) {
        return new Piece(
            id,
            playerColor,
            DiceFace.SCISSOR,
            DiceFace.ROCK,
            DiceFace.PAPER
        );
    }

    static buildInitialRockDice(id: string, playerColor: PlayerColor) {
        return new Piece(
            id,
            playerColor,
            DiceFace.ROCK,
            DiceFace.SCISSOR,
            DiceFace.PAPER
        );
    }

    static buildInitialPaperDice(id: string, playerColor: PlayerColor) {
        return new Piece(
            id,
            playerColor,
            DiceFace.PAPER,
            DiceFace.ROCK,
            DiceFace.SCISSOR
        );
    }

    // Method to get the piece's display character
    getDisplay(): string {
        return this.topFace;
    }
}
