import * as WebSocket from 'ws';
import * as http from 'http';
import { MessageWithState, Player, Room } from './room';

export abstract class WsController<M, P extends Player, R extends Room> {
    // TODO: abstract roomMap management into an abstract class
    public roomMap: { [key: string]: R };

    protected constructor() {
        this.roomMap = {};
    }

    abstract onConnection(ws: WebSocket, request: http.IncomingMessage): void;

    abstract onMessage(state: MessageWithState<M>): void;

    public defaultAddOnMessage(
        ws: WebSocket,
        request: http.IncomingMessage,
        player: P
    ) {
        ws.on('message', (data: Buffer) => {
            const parsedData = JSON.parse(data.toString());
            this.onMessage({
                message: parsedData,
                player,
                request,
            });
        });
    }

    protected emitToAllPlayers(room: R, command: M) {
        room.players.forEach((player) => {
            this.emitToPlayer(player, command);
        });
    }

    protected emitToPlayer(player: Player, command: M) {
        player.send(command);
    }

    protected getRoomId(request: http.IncomingMessage): string {
        const params = new URL(request.url!, `ws://${request.headers.host}`)
            .searchParams;
        return params.get('roomId')!;
    }

    protected getRoom(request: http.IncomingMessage): R {
        return this.roomMap[this.getRoomId(request)];
    }

    protected setRoom(room: R): void {
        this.roomMap[room.roomId] = room;
    }
}

/*
 * 1. P1 makes a move: -> BE
 * 2. BE validates the move against board state (persisted in-memory?)
 * 3. BE adjust board state
 * 4. BE forwards the board state to P2
 *
 *
 * */
