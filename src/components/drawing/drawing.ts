import robot from 'robotjs';

const drawFigure = {
    'circle': ( x: number, y: number, radius: number ): void => {
        const twoPI = Math.PI * 2.0;
        robot.moveMouse(x + Number(radius), y);
        robot.mouseClick('left');
        robot.mouseToggle('down');
        setTimeout(()=>{
            for (let i = 0; i <= Math.PI * 2; i += 0.01) {
                const currX = x + (Number(radius) * Math.cos(i));
                const currY = y + (Number(radius) * Math.sin(i));
                robot.dragMouse(currX, currY);
            }
            robot.mouseToggle('up');
        },400)
        
    },
    'line': (x0: number, y0: number, destX: number, destY: number) => {
        const diffX = destX - x0;
        const signX = diffX ===0 ? +1 : diffX / Math.abs(diffX)
        const diffY = destY - y0;
        const signY = diffY === 0 ? +1 : diffY / Math.abs(diffY);
        const maxDiff = Math.max(diffX * signX, diffY * signY);
        const stepX = diffX / maxDiff;
        const stepY = diffY/ maxDiff;
        robot.mouseClick('left');
        robot.mouseToggle('down');
        let count = 0;

        while (count < maxDiff) {
            const currx = x0 + count * stepX;
            const curry = y0 + count * stepY;

            robot.dragMouse(currx,  curry);
            count++;
        }
    },
    'rectangle': (x: number, y: number, params: number[] ) => {
        const [width, height] = params.map( item => Number(item));
        let x0 = x; 
        let y0= y;
        drawFigure.line( x0, y0, x + Number(width), y);
        x0 = x + width;
        drawFigure.line(x0, y0, x + width, y + Number(height));
        y0 = y + height;
        drawFigure.line(x0, y0, x, y + Number(height));
        x0 = x;
        drawFigure.line(x0, y0,x, y);
        robot.mouseToggle('up');
    },
    'square': (x: number, y: number, size: number) => drawFigure.rectangle(x, y, [size,size])
}

export default drawFigure;