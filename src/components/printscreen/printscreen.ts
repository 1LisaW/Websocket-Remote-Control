import Jimp from 'jimp';
import robot from 'robotjs';

const screenCaptureToFile = function () {
    return new Promise((resolve, reject) => {
        try {
            const picture = robot.screen.capture(robot.getMousePos().x-100, robot.getMousePos().y-100, 200, 200);
            const image = new Jimp(picture.width, picture.height, function (_, img) {
                img.bitmap.data = picture.image;
                
                let redColor:any, greenColor: any, blueColor: any;
                picture.image.forEach((byte:any, i: number) => {
                switch (i % 4) {
                    case 0: return blueColor = byte
                    case 1: return greenColor = byte
                    case 2: return redColor = byte
                    case 3: 
                        img.bitmap.data[i - 3] = redColor
                        img.bitmap.data[i - 2] = greenColor
                        img.bitmap.data[i - 1] = blueColor
                        img.bitmap.data[i] = 255
                    }
                })

                return img.getBase64(Jimp.MIME_PNG, (_, png) => {
                    resolve(png);
                });
            });
            
            return image;
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export default screenCaptureToFile;
