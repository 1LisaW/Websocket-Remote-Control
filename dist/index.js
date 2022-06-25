"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./src/http_server/index");
const stream_1 = require("stream");
// import robot from 'robotjs';
const ws_1 = require("ws");
const mouse_commands_1 = __importDefault(require("./src/mouse_behavior/mouse_commands"));
const HTTP_PORT = 3000;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
index_1.httpServer.listen(HTTP_PORT);
const wss = new ws_1.WebSocketServer({
    port: 8080
});
wss.on('connection', (ws) => {
    ws.send('connection settled');
    const duplex = (0, ws_1.createWebSocketStream)(ws, {
        encoding: 'utf8',
        objectMode: true,
        decodeStrings: false,
        autoDestroy: false,
        emitClose: false
    });
    duplex.on("data", async (chunk) => {
        const result = (0, mouse_commands_1.default)(chunk);
        if (typeof result === 'string') {
            duplex.write(result, 'utf8');
        }
        else if (result !== undefined) {
            const buff = await result;
            const stream = new stream_1.Duplex({
                encoding: 'base64',
                objectMode: true,
                decodeStrings: false
            });
            stream.push(`prnt_scrn ${buff.replace('data:image/png;base64,', '')}`);
            stream.push(null);
            stream.pipe(duplex, { end: false });
        }
    });
    duplex.on("close", () => {
        console.log('duplex closed');
    });
});
process.on('SIGINT', () => {
    wss.close();
    index_1.httpServer.close();
});
process.on('SIGTERM', () => {
    index_1.httpServer.close();
});
process.on('uncaughtException', (error) => {
    index_1.httpServer.close();
    // console.log(error);
});
wss.on('close', () => {
    console.log('websocket stream closed');
    index_1.httpServer.close();
});
//# sourceMappingURL=index.js.map