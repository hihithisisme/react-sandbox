import { readFile } from "fs/promises";
import { HeroInfo } from "../components/SanGuoSha";

const HERO_INFO_JSON_FILEPATH = 'features/sanguosha/characters.json';
const RULER_HERO_INFO_JSON_FILEPATH = 'features/sanguosha/ruler_characters.json';
let heroInfoJson: HeroInfo[];
let rulerHeroInfoJson: HeroInfo[];

export class Deck {
    private deck: HeroInfo[];
    private rulerDeck: HeroInfo[];

    constructor() {
        this.deck = [];
        this.rulerDeck = [];
    }

    async loadDeck() {
        this.deck = await fetchHeroInfoJson();
        this.rulerDeck = await fetchRulerHeroInfoJson();
        this.shuffle();
    }

    private shuffle(): void {
        shuffleArray(this.deck);
        shuffleArray(this.rulerDeck);
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

    drawRulers(n: number): HeroInfo[] {
        const res = [];
        for (let i = 0; i < n; i++) {
            res.push(this.rulerDeck.pop()!);
        }
        return res;
    }

    removeHeroes(...heroes: HeroInfo[]) {
        for (const toBeRemoved of heroes) {
            this.deck = this.deck.filter((heroInfo) => {
                return heroInfo.name !== toBeRemoved.name;
            });
        }
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
    return [...heroInfoJson];
}
async function fetchRulerHeroInfoJson(): Promise<HeroInfo[]> {
    if (rulerHeroInfoJson === undefined) {
        rulerHeroInfoJson = JSON.parse(await readFile(RULER_HERO_INFO_JSON_FILEPATH, "utf8"));
    }
    return [...rulerHeroInfoJson];
}
