import { Coordinate, coordToString, DiceFace, Piece } from './data';

export interface NodeData {
    topFace: DiceFace;
    coordinate: Coordinate;
}

export class TrieNode {
    children: Map<Coordinate, TrieNode>;
    isEndOfSequence: boolean;
    payload: NodeData;

    constructor(payload: NodeData) {
        this.children = new Map();
        this.isEndOfSequence = false;
        this.payload = payload;
    }

    toString(): string {
        return `${this.payload.topFace} | ${Array.from(
            this.children.entries()
        ).map(
            ([coord, node]) => `${coordToString(coord)}${node.payload.topFace}`
        )}`;
    }
}

// Although this Trie class is specific to RpsChess, take note that it does not consider
// number of moves left for the piece.
export default class Trie {
    root: TrieNode;
    piece: Piece;
    startingCoordinate: Coordinate;

    constructor(piece: Piece, startingCoordinate: Coordinate) {
        this.root = new TrieNode({
            coordinate: startingCoordinate,
            topFace: piece.topFace,
        });
        this.piece = piece;
        this.startingCoordinate = startingCoordinate;
    }

    // sequence excludes startingCoordinate
    insert(sequence: NodeData[]): void {
        let node = this.root;
        for (const move of sequence) {
            if (!node.children.has(move.coordinate)) {
                node.children.set(move.coordinate, new TrieNode(move));
            }
            node = node.children.get(move.coordinate)!;
        }
        node.isEndOfSequence = true;
    }

    // sequence excludes startingCoordinate
    search(sequence: Coordinate[], endTopFace: DiceFace): boolean {
        let node = this.root;
        for (const move of sequence) {
            if (!node.children.has(move)) {
                return false;
            }
            node = node.children.get(move)!;
        }
        if (node.isEndOfSequence) {
            return node.payload.topFace === endTopFace;
        }
        return false;
    }

    getPointerToPrefixNode(sequence: Coordinate[]): TrieNode | null {
        let node = this.root;
        for (const move of sequence) {
            if (!node.children.has(move)) {
                return null;
            }
            node = node.children.get(move)!;
        }
        return node;
    }
}
