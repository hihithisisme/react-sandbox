export interface ISign {
    sign: string;
    size: string | null;
    filled: boolean;
}

export function deserializeSign(str: string | null): ISign | null {
    if (str === null) {
        return null;
    }

    const parts = str.split('-');
    const sign = parts[0];

    let sizeIndex = null;
    let filled = false;
    if (parts.length > 1) {
        sizeIndex = parseInt(parts[1], 10);
        filled = true;
    }
    return {
        sign,
        filled,
        size: sizeIndex !== null ? squareSizeMap[sizeIndex] : null,
    };
}

export function serializeSign(sign: ISign | null): string | null {
    if (sign === null) {
        return null;
    } else if (sign.size === null) {
        return sign.sign;
    }

    const size = squareSizeMap
        .map((value, index) => {
            if (sign.sign === value) {
                return index;
            } else {
                return -1;
            }
        })
        .filter((value) => value !== -1)[0];

    return `${sign.sign}-${size}`;
}

const squareSizeMap = Array(3)
    .fill('')
    .map((_, index) => `${index * 20 + 40}px`);
console.log(squareSizeMap);
