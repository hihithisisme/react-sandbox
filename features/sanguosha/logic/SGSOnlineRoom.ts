import { Player, Room } from "../../../websocket/room";
import * as WebSocket from 'ws';
import { Deck } from "./deck";
import { HeroInfo } from "../components/SanGuoSha";

export class SGSOnlineRoom extends Room<SGSPlayer> {
    rulerId?: string;
    deck: Deck;
    selectedHeroes: Record<string, HeroInfo>;

    constructor(roomId: string) {
        super(roomId);
        this.deck = new Deck();
        this.selectedHeroes = {}
        this.reset();
    }

    async init(ruler: string) {
        await this.deck.loadDeck();
        this.rulerId = ruler;
    }

    playerSubmits(playerId: string, hero: HeroInfo) {
        this.selectedHeroes[playerId] = hero;
    }

    reset() {
        this.rulerId = undefined;
        this.deck = new Deck();
    }

    isReady(): boolean {
        // this.removeDisconnectedPlayers();
        // return this.players.length === 2;
        return !!this.rulerId;
    }
}

export class SGSPlayer extends Player {
    constructor(id: string, socket: WebSocket) {
        super(id, socket);
    }
}