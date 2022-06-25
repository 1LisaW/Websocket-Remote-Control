"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { resolveObjectURL } from 'buffer';
// import { stdout } from 'process';
const robotjs_1 = __importDefault(require("robotjs"));
const printscreen_1 = __importDefault(require("./printscreen"));
;
;
const mouseMoves = {
    'up': (x, y, diff) => { return robotjs_1.default.moveMouse(x, y - diff); },
    'down': (x, y, diff) => { return robotjs_1.default.moveMouse(x, Number(y) + Number(diff)); },
    'left': (x, y, diff) => { return robotjs_1.default.moveMouse(x - diff, y); },
    'right': (x, y, diff) => { return robotjs_1.default.moveMouse(Number(x) + Number(diff), y); },
};
const mouseCommands = {
    'mouse_up': (x, y, diff) => { mouseMoves.up(x, y, diff); },
    'mouse_down': (x, y, diff) => { mouseMoves.down(x, y, diff); },
    'mouse_left': (x, y, diff) => { mouseMoves.left(x, y, diff); },
    'mouse_right': (x, y, diff) => { mouseMoves.right(x, y, diff); },
    'draw_circle': (x, y, radius) => { drawFigure.circle(x, y, radius); },
    'draw_rectangle': (x, y, params) => { drawFigure.rectangle(x, y, params); },
    'draw_square': (x, y, params) => { drawFigure.square(x, y, params); },
    'mouse_position': () => { return ` ${robotjs_1.default.getMousePos().x},${robotjs_1.default.getMousePos().y}`; }
};
const drawFigure = {
    'circle': (x, y, radius) => {
        const twoPI = Math.PI * 2.0;
        robotjs_1.default.moveMouse(x + Number(radius), y);
        robotjs_1.default.mouseClick('left');
        robotjs_1.default.mouseToggle('down');
        setTimeout(() => {
            for (let i = 0; i <= Math.PI * 2; i += 0.01) {
                const currX = x + (Number(radius) * Math.cos(i));
                const currY = y + (Number(radius) * Math.sin(i));
                robotjs_1.default.dragMouse(currX, currY);
            }
            robotjs_1.default.mouseToggle('up');
        }, 400);
    },
    'line': (x0, y0, destX, destY) => {
        const diffX = destX - x0;
        const signX = diffX === 0 ? +1 : diffX / Math.abs(diffX);
        const diffY = destY - y0;
        const signY = diffY === 0 ? +1 : diffY / Math.abs(diffY);
        const maxDiff = Math.max(diffX * signX, diffY * signY);
        const stepX = diffX / maxDiff;
        const stepY = diffY / maxDiff;
        robotjs_1.default.mouseClick('left');
        robotjs_1.default.mouseToggle('down');
        let count = 0;
        while (count < maxDiff) {
            const currx = x0 + count * stepX;
            const curry = y0 + count * stepY;
            robotjs_1.default.dragMouse(currx, curry);
            count++;
        }
    },
    'rectangle': (x, y, params) => {
        const [width, height] = params.map(item => Number(item));
        let x0 = x;
        let y0 = y;
        drawFigure.line(x0, y0, x + Number(width), y);
        x0 = x + width;
        drawFigure.line(x0, y0, x + width, y + Number(height));
        y0 = y + height;
        drawFigure.line(x0, y0, x, y + Number(height));
        x0 = x;
        drawFigure.line(x0, y0, x, y);
        robotjs_1.default.mouseToggle('up');
    },
    'square': (x, y, size) => drawFigure.rectangle(x, y, [size, size])
};
const makeAction = (data) => {
    let x = Number(robotjs_1.default.getMousePos().x);
    let y = Number(robotjs_1.default.getMousePos().y);
    const [mouseCommand, ...restParams] = data.split(' ');
    let diffPx;
    if (Array.isArray(restParams)) {
        diffPx = restParams.map(item => Number(item));
    }
    if (restParams.length === 1) {
        diffPx = restParams[0];
    }
    ;
    mouseCommand;
    if (mouseCommands.hasOwnProperty(mouseCommand)) {
        const result = mouseCommands[mouseCommand](x, y, diffPx);
        return result ? `${mouseCommand}${result}\0` : mouseCommand;
    }
    else if (mouseCommand === 'prnt_scrn') {
        return (0, printscreen_1.default)();
    }
};
exports.default = makeAction;
//# sourceMappingURL=mouse_commands.js.map