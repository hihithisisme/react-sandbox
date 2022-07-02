// min and max included
export function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomBool(): boolean {
    return randomIntFromInterval(0, 1) == 0;
}

export function randomlyChooseElement<T>(list: T[]): T {
    return list[randomIntFromInterval(0, list.length - 1)];
}
