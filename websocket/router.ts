import * as http from 'http';
import * as WebSocket from 'ws';
import { SimpleOnlineController } from '../tictactoe/SimpleOnlineController';
import { WsController } from './controller';
import { StackingController } from '../tictactoe/stacking/StackingController';

export class WebSocketRouter {
    public server: WebSocket.Server;
    private pathMap: { [path: string]: WsController<any, any, any> };

    constructor() {
        this.server = new WebSocket.Server({ noServer: true });
        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('error', this.onError.bind(this));
        this.server.on('close', this.onClose.bind(this));

        this.pathMap = {
            '/tictactoe/online': new SimpleOnlineController(),
            '/tictactoe/stacking': new StackingController(),
        };
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        const path = new URL(request.url!, `ws://${request.headers.host}`)
            .pathname;
        this.pathMap[path].onConnection(ws, request);
    }

    onError(err: Error): void {
        console.log('websocket error', err);
    }

    onClose(): void {
        console.log('websocket closing');
    }
}
