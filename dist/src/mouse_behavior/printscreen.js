"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
const robotjs_1 = __importDefault(require("robotjs"));
const screenCaptureToFile = function () {
    return new Promise((resolve, reject) => {
        try {
            console.log('screenCaptureToFile promise');
            const picture = robotjs_1.default.screen.capture(robotjs_1.default.getMousePos().x - 100, robotjs_1.default.getMousePos().y - 100, 200, 200);
            const image = new jimp_1.default(picture.width, picture.height, function (err, img) {
                img.bitmap.data = picture.image;
                let red, green, blue;
                picture.image.forEach((byte, i) => {
                    switch (i % 4) {
                        case 0: return blue = byte;
                        case 1: return green = byte;
                        case 2: return red = byte;
                        case 3:
                            img.bitmap.data[i - 3] = red;
                            img.bitmap.data[i - 2] = green;
                            img.bitmap.data[i - 1] = blue;
                            img.bitmap.data[i] = 255;
                    }
                });
                return img.getBase64(jimp_1.default.MIME_PNG, (err, png) => {
                    console.log('screenCaptureToFile promise return callback');
                    resolve(png);
                });
            });
            return image;
        }
        catch (e) {
            console.error(e);
            reject(e);
        }
    });
};
exports.default = screenCaptureToFile;
//# sourceMappingURL=printscreen.js.map