import * as WebSocket from 'ws';
import { Player, Room } from "../../../websocket/room";
import { HeroInfo } from "../components/SanGuoSha";
import { Deck } from "./deck";

export class SGSOnlineRoom extends Room<SGSPlayer> {
    rulerId?: string;
    deck: Deck;

    constructor(roomId: string) {
        super(roomId);
        this.deck = new Deck();
        this.reset();
    }

    async init(ruler: string) {
        await this.deck.loadDeck();
        this.rulerId = ruler;
    }

    playerSubmits(playerId: string, hero: HeroInfo, username: string) {
        const player = this.getPlayerById(playerId)!;
        player.setUsername(username);
        player.setSelectedHero(hero);
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
    username: string;
    selectedHero?: HeroInfo;

    constructor(id: string, socket: WebSocket) {
        super(id, socket);
        this.username = id;
    }

    setUsername(username: string) {
        this.username = username;
    }

    setSelectedHero(hero: HeroInfo) {
        this.selectedHero = hero;
    }
}