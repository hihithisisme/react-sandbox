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

export function weightedRandomSample<T>(list: T[], weights: number[]): T {
    const sum = weights.reduce((previousValue, currentValue) => previousValue + currentValue);
    const r = randomIntFromInterval(0, sum);
    let remaining = sum;
    for (let i = 0; i < list.length; i++) {
        const weight = weights[i];
        remaining -= weight;
        if (remaining < r) {
            return list[i];
        }
    }
    return list[0];
}
