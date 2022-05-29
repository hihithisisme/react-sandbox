export interface ISign {
    sign: string;
    size: string;
    filled: boolean;
}

export function deserializeSign(str: string | null): ISign | null {
    if (str === null) {
        return null;
    }

    const parts = str.split('-');
    const sign = parts[0];

    let size: string;
    let filled = false;
    if (parts.length > 1) {
        size = squareSizeMap[parseInt(parts[1], 10)];
        filled = true;
    } else {
        size = '60px';
    }

    return { sign, size, filled };
}

export function encodeSign(
    sign: string | null,
    relativeSize?: number
): string | null {
    if (sign === null) {
        return null;
    } else if (relativeSize === undefined) {
        return sign;
    }

    return `${sign}-${relativeSize}`;
}

// TODO: Possibly make the square sizes similarly responsive as the board size
const squareSizeMap = Array(3)
    .fill('')
    .map((_, index) => `${index * 20 + 40}px`);
