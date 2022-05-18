import next from 'next';
import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import WebSocket from 'ws';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    // Express server - for handling incoming HTTP requests from Gravio
    const expressApp = express();

    // Node http server - added to for integrating WebSocket server
    const server = createServer(expressApp);

    // WebSocket server - for sending realtime updates to UI
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('close', () => {
        console.log('ws closing');
    });

    wss.on('connection', (socket, request) => {
        console.log('connection');

        console.log(request.url);

        socket.on('message', (data: Buffer) => {
            console.log('message', data.toString());
            socket.send('{"world":"hello"}');
        });
    });

    server.on('upgrade', function (req, socket, head) {
        const { pathname } = parse(req.url!, true);
        if (pathname !== '/_next/webpack-hmr') {
            wss.handleUpgrade(req, socket, head, function done(ws: any) {
                wss.emit('connection', ws, req);
            });
        }
    });

    // HTTP route for handling 'No' button source requests:
    // expressApp.get('/buttons/no', function (req, res) {
    //     wss.clients.forEach((client) => {
    //         if (client.readyState === WebSocket.OPEN) {
    //             // Note: we add a `time` attribute to help with the UI state management
    //             client.send(
    //                 JSON.stringify({ type: 'buttons:no', time: new Date() })
    //             );
    //         }
    //     });
    //
    //     res.send('buttons:no');
    // });

    expressApp.all(/^\/_next\/webpack-hmr(\/.*)?/, (req, res) => {
        void nextHandler(req, res);
    });

    // To handle Next.js routing
    expressApp.all('*', (req, res) => {
        return nextHandler(req, res);
    });

    // Start the server!
    server.listen(port, () => {
        // if (err) throw err;
        console.log(`Ready on http://127.0.0.1:${port}`);
    });
});
