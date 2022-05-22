import next from 'next';
import { WebSocketRouter } from './websocket/router';
import { parse } from 'url';
import { createServer } from 'http';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = createServer((req, res) =>
        nextHandler(req, res, parse(req.url!, true))
    );

    // Setup websockets
    const wsw = new WebSocketRouter();
    server.on('upgrade', function (req, socket, head) {
        const { pathname } = parse(req.url!, true);
        if (pathname !== '/_next/webpack-hmr') {
            wsw.server.handleUpgrade(req, socket, head, function done(ws: any) {
                wsw.server.emit('connection', ws, req);
            });
        }
    });

    // Start the server!
    server.listen(port, () => {
        console.log(`Ready on`, server.address());
    });
});
