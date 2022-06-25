import robot from 'robotjs';

import mouseCommands from './mouse-control/mouse_commands';
import screenCaptureToFile from './printscreen/printscreen';


const makeAction = (data: string) => {
    let x = Number(robot.getMousePos().x);
    let y = Number(robot.getMousePos().y);
    const  [ mouseCommand, ...restParams ] = data.split(' ');
    let diffPx;
    if( Array.isArray(restParams)) { 
        diffPx = restParams.map( item => Number(item)) as number[];
    }
    if (restParams.length === 1){ 
        diffPx = restParams[0];
    };
    
    mouseCommand as string;

    if ( mouseCommands.hasOwnProperty(mouseCommand)) {
         const result = mouseCommands[mouseCommand as keyof typeof mouseCommands]( x, y, diffPx as number & number[] );
         return result? `${mouseCommand}${result}\0`: mouseCommand
    }
    else if( mouseCommand === 'prnt_scrn'){
        return screenCaptureToFile()
    }
}

export default makeAction