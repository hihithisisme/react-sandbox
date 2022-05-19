import * as http from 'http';
import * as WebSocket from 'ws';
import { WsTicTacToe } from './api/tictactoe/_live';

export class WebSocketRouter {
    public server: WebSocket.Server;
    // TODO: pathMap to mount multiple routes
    // private pathMap: { [path: string]: WsTicTacToe }
    private tttController: WsTicTacToe;

    constructor() {
        this.server = new WebSocket.Server({ noServer: true });
        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('error', this.onError.bind(this));
        this.server.on('close', this.onClose.bind(this));

        this.tttController = new WsTicTacToe();
    }

    onConnection(ws: WebSocket, request: http.IncomingMessage): void {
        // const url = new URL(request.url!, `ws://${request.headers.host}`)
        this.tttController.onConnection(ws, request);
    }

    onError(err: Error): void {
        console.log('websocket error', err);
    }

    onClose(): void {
        console.log('websocket closing');
    }
}
