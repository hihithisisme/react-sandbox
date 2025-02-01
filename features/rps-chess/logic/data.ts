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

export function addCoords(c1: Coordinate, c2: Coordinate): Coordinate {
    return newCoord(c1.x + c2.x, c1.y + c2.y);
}

export function eqCoords(c1: Coordinate, c2: Coordinate): boolean {
    return c1.x === c2.x && c1.y === c2.y;
}

export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

// These vectors apply to the displayCoordinate from the perspective as White
// For Black, all vectors should be flipped.
export const DIRECTION_MAP = {
    [Direction.UP]: newCoord(0, 1),
    [Direction.DOWN]: newCoord(0, -1),
    [Direction.LEFT]: newCoord(-1, 0),
    [Direction.RIGHT]: newCoord(1, 0),
} as const;

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

    // This method mutates the Piece instance in place
    roll(direction: Direction): Piece {
        switch (direction) {
            case Direction.UP:
            case Direction.DOWN:
                this.topFace = this.colFace;
                this.colFace = this.topFace;
                break;
            case Direction.LEFT:
            case Direction.RIGHT:
                this.topFace = this.rowFace;
                this.rowFace = this.topFace;
                break;
        }
        return this;
    }

    copy(): Piece {
        return new Piece(
            this.id,
            this.playerColor,
            this.topFace,
            this.colFace,
            this.rowFace
        );
    }

    // Method to get the piece's display character
    getDisplay(): string {
        return this.topFace;
    }
}
