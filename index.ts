import {httpServer} from './src/http_server/index';
import { Duplex } from 'stream';

import {
    WebSocketServer,
    createWebSocketStream
} from 'ws';

import makeAction from './src/components/app';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
    port: 8080
});
wss.on('connection', (ws, request) => {
    ws.send('connection settled');
    console.log(`Websocket parameters:`);
    console.log(request.headers);


    ws.on("open", ()=>{
        console.log('ws opened')
    })

   const duplex = createWebSocketStream(ws, {
       encoding: 'utf8',
       objectMode: true,
       decodeStrings: false,
       autoDestroy: false,
       emitClose: false 
   });
   
   duplex.on("data", async (chunk) => {
        process.stdout.write(`Recieved from front: ${chunk}\n`);
       const result = makeAction(chunk);
       
        if (typeof result === 'string'){
            duplex.write(result, 'utf8');
            process.stdout.write(`Result: ${result} completed successfully\n`);
        }
        else if(result!== undefined){
    
            const buff = await result as string;
            const buffData = buff.replace('data:image/png;base64,','')
            const stream = new Duplex({
                encoding: 'base64',
                objectMode: true,
                decodeStrings: false
            });
            
            stream.push(`prnt_scrn ${buffData}`);
            stream.push(null);
            stream.pipe(duplex, { end: false });
            
            stream.on("end", () =>{
                process.stdout.write(`Result: ${buffData} completed successfully\n`);
                stream.destroy();
            })
        }
        else{
            process.stdout.write(`Result: completed with error\n`);
        }
   })

   duplex.on("end", () => {
       console.log('websocket stream was closed');
   })
})

   process.on('SIGINT', () => {
        wss.close();
        httpServer.close()

   })

   process.on('SIGTERM', () =>{
     httpServer.close()
   });

   wss.on('close', () => {
        httpServer.close()

   });

    