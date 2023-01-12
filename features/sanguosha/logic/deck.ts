import { readFile } from "fs/promises";
import { HeroInfo } from "../components/SanGuoSha";

const HERO_INFO_JSON_FILEPATH = 'features/sanguosha/characters.json';
let heroInfoJson: HeroInfo[];

export class Deck {
    private deck: HeroInfo[];

    constructor() {
        this.deck = [];
    }

    async loadDeck() {
        this.deck = await fetchHeroInfoJson();
        this.shuffle();
    }

    private shuffle(): void {
        shuffleArray(this.deck);
    }

    length(): number {
        return this.deck.length;
    }

    draw(n: number): HeroInfo[] {
        const res = [];
        for (let i = 0; i < n; i++) {
            res.push(this.deck.pop()!);
        }
        return res;
    }
}

// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


async function fetchHeroInfoJson(): Promise<HeroInfo[]> {
    if (heroInfoJson === undefined) {
        heroInfoJson = JSON.parse(await readFile(HERO_INFO_JSON_FILEPATH, "utf8"));
    }
    return heroInfoJson;
}
