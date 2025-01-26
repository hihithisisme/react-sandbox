import { Piece } from '../features/rps-chess/logic/data';

// This file should be used for all JSON serialization and deserialization within websocket/
export function replacer(key: string, value: any) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } else if (value instanceof Piece) {
        return {
            dataType: 'Piece',
            value: value.serialize(),
        };
    } else {
        return value;
    }
}

export function reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        } else if (value.dataType === 'Piece') {
            return Piece.deserialize(value.value);
        }
    }
    return value;
}
