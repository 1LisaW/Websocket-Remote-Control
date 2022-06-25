import robot from 'robotjs';
import drawFigure from '../drawing/drawing';


interface CallbackPropArray{ 
    [key: string]: (x:number, y: number, diff: number[]) => void 
};

interface CallbackPropNumber{ 
    [key: string]: (x:number, y: number, diff: number) => void 
};

interface MouseMoves {
    [key: string]: (x:number, y: number, diff: number) => void
}

const mouseMoves: MouseMoves = {
    'up': ( x: number, y: number, diff: number ) => { return robot.moveMouse( x, y - diff )},
    'down': ( x: number, y: number, diff: number ) => { return robot.moveMouse( x, Number(y) + Number(diff) ) },
    'left': ( x: number, y: number, diff: number ) => { return robot.moveMouse( x - diff, y ) },
    'right': ( x: number, y: number, diff: number ) => { return robot.moveMouse( Number(x) + Number(diff), y ) },
}

interface MouseCommands {
    'mouse_up': (x:number, y: number, diff: number) => void,
    'mouse_down': (x:number, y: number, diff: number) => void,
    'mouse_left': (x:number, y: number, diff: number) => void,
    'mouse_right': (x:number, y: number, diff: number) => void,
    'draw_circle': (x:number, y: number, diff: number) => void,
    'draw_rectangle': (x:number, y: number, diff: number[]) => void,
    'draw_square': (x:number, y: number, diff: number) => void,
    'mouse_position': () => string,
}

type MouseKeys = keyof MouseCommands;

const mouseCommands: MouseCommands = {
    'mouse_up': (x: number, y: number, diff: number): void => { mouseMoves.up(x, y, diff);  },
    'mouse_down': (x: number, y: number, diff: number): void => {  mouseMoves.down(x, y, diff)},
    'mouse_left': (x: number, y: number, diff: number): void => { mouseMoves.left(x, y, diff) },
    'mouse_right': (x: number, y: number, diff: number): void => { mouseMoves.right(x, y, diff) },
    'draw_circle': (x: number, y: number, radius: number): void => { drawFigure.circle(x, y, radius) },
    'draw_rectangle': (x: number, y: number, params: number[]): void => { drawFigure.rectangle(x, y, params) },
    'draw_square': (x: number, y: number, params: number): void => { drawFigure.square(x, y, params) },
    'mouse_position': (): string => { return ` ${robot.getMousePos().x},${robot.getMousePos().y}`}
}

export default mouseCommands;