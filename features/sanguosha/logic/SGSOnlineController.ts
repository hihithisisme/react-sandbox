import { randomUUID } from 'crypto';
import * as http from 'http';
import * as WebSocket from 'ws';
import { WsController } from "../../../websocket/controller";
import { MessageWithState } from '../../../websocket/room';
import { HeroInfo } from '../components/SanGuoSha';
import { DrawCmd, SGSAction, SGSCommand, SubmitReq } from "./messages";
import { SGSOnlineRoom, SGSPlayer } from "./SGSOnlineRoom";


/* 
Commands for Websocket
- INIT: start the process (only aesthetic change)
- DRAW: draw fixed set of cards (chosen by server) [issued by server]
    - RULER: ask server to issue more cards (ruler cards) to one client (but still use DRAW to do so) [issued by client]
- REPLACE: replace one card (chosen by server) [issued by client]
- SUBMIT: [issued by client] indicate to server what client chose
- SHOW: [issued by server once all clients have submitted] display to all clients, the selection of cards
    - SHOW_RULER: [issued by server when ruler client has submitted] show to all clients which Hero the ruler has selected 
*/

export class SGSController extends WsController<SGSCommand, SGSPlayer, SGSOnlineRoom> {
    constructor() {
        super();
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const roomId = this.getRoomId(request);
        console.log(`connection: roomId={${roomId}}`);

        const room = this.getRoom(request) || new SGSOnlineRoom(roomId);
        const player = new SGSPlayer(randomUUID(), ws);
        room.addPlayer(player);
        this.setRoom(room);

        this.defaultAddOnMessage(ws, request, player);
        // this.defaultScheduledPing(ws);

        // TODO: check cookie params to see if previously in game and retrieve state if so. else, just continue

        // TODO: move this to a onRuler handler
        // if (room.isReady()) {
        //     this.emitInit(room);
        // }
    }

    async onRuler(state: MessageWithState<SGSCommand>): Promise<void> {
        const room = this.getRoom(state.request);
        room.rulerId = state.player.id;

        await room.init(room.rulerId);

        this.emitDrawForRuler(room);
        this.emitInit(room);
    }

    onReplace(state: MessageWithState<SGSCommand>): void {
        const room = this.getRoom(state.request);

    }

    onSubmit(state: MessageWithState<SGSCommand>): void {
        const submitReqPayload = state.message.data as SubmitReq;
        const playerId = state.player.id;
        const room = this.getRoom(state.request);

        room.playerSubmits(playerId, submitReqPayload.hero, submitReqPayload.username);
        if (playerId === room.rulerId) {
            this.emitShowRuler(room);
            room.deck.removeHeroes(submitReqPayload.hero);
            this.emitDrawForNonRuler(room);
        }
        console.log('room.players', room.players);
        const numOfSelectedHeroes = room.players.filter((player) => !!player.selectedHero).length;
        if (numOfSelectedHeroes === room.players.length) {
            this.emitShow(room);
        }
    }

    async onMessage(state: MessageWithState<SGSCommand>): Promise<void> {
        console.log(`message:`, state.message);

        switch (state.message.action) {
            case SGSAction.RULER_REQ:
                return await this.onRuler(state);
            case SGSAction.REPLACE_REQ:
                return this.onReplace(state);
            case SGSAction.SUBMIT_REQ:
                return this.onSubmit(state);
            default:
                console.log('unrecognisable action:', state.message);
                return;
        }
    }

    private emitDrawForRuler(room: SGSOnlineRoom) {
        const rulerPlayer = room.getPlayerById(room.rulerId!)!;
        // TODO: There is a small chance that there might be a duplicate (ruler) hero appear
        const heroes: HeroInfo[] = Array().concat(room.deck.draw(3), room.deck.drawRulers(3));

        this.emitToPlayer(rulerPlayer, {
            action: SGSAction.DRAW_CMD,
            data: {
                heroes,
            }
        })
    }

    private emitDrawForNonRuler(room: SGSOnlineRoom) {
        room.players.forEach((player, index) => {
            if (player.id === room.rulerId) {
                return;
            }

            this.emitToPlayer(player, {
                action: SGSAction.DRAW_CMD,
                data: {
                    heroes: room.deck.draw(3),
                } as DrawCmd
            })
        })
    }

    private emitShowRuler(room: SGSOnlineRoom) {
        const ruler = room.getPlayerById(room.rulerId!)!;
        this.emitToAllPlayers(room, {
            action: SGSAction.SHOW_RULER_CMD,
            data: {
                ruler,
            }
        })
    }

    private emitShow(room: SGSOnlineRoom) {
        this.emitToAllPlayers(room, {
            action: SGSAction.SHOW_CMD,
            data: {
                players: room.players,
            }
        });
    }

    private emitReset(room: SGSOnlineRoom) {
    }

    private emitInit(room: SGSOnlineRoom) {
        // room.reset();

        room.players.forEach((player) => {
            this.emitToPlayer(player, {
                action: SGSAction.INIT_CMD,
                data: {
                    ruler: room.getPlayerById(room.rulerId!)!,
                },
            });
        });
    }

}