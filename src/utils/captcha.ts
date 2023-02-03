import { createCanvas, registerFont, DOMMatrix } from 'canvas';
import path from 'node:path';

export class Captcha {
    options: any;

    constructor (options: any) {
        options.color        = options.color || 'rgb(0,0,0)'
        options.background   = options.background || 'rgb(255,255,255)'
        options.lineWidth    = options.lineWidth || 1
        options.fontSize     = options.fontSize || 30
        options.codeLength   = options.length || 4
        options.canvasWidth  = options.width || 150
        options.canvasHeight = options.height || 32
        options.type         = options.type || 'normal';     //normal 普通  number 仅数字 letter 仅字母 arithmetic 算数题
        options.fontPath = options.fontPath || path.join(__dirname, './font/captchaFont.ttf');

        this.options = options;
    }

    async generate (): Promise<any> {
        const canvas = createCanvas(this.options.canvasWidth, this.options.canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.antialias = 'gray';
        ctx.fillStyle = this.options.background;
        ctx.fillRect(0, 0, this.options.canvasWidth, this.options.canvasHeight);
        ctx.strokeRect(0, 0, this.options.canvasWidth, this.options.canvasHeight);
        ctx.fillStyle = this.options.color;
        ctx.lineWidth = this.options.lineWidth;

        // registerFont(this.options.fontPath, {family: 'enFont'});
        ctx.font = 'normal normal ' + this.options.fontSize + 'px ';

        ctx.strokeStyle = 'grey';
        for (var i = 0; i < 3; i++) {
            ctx.moveTo(10, Math.random() * this.options.canvasHeight);
            ctx.bezierCurveTo(80, Math.random() * this.options.canvasHeight, 160, Math.random() * this.options.canvasHeight, this.options.canvasWidth - 20, Math.random() * this.options.canvasHeight);
            ctx.stroke();
        }

        ctx.strokeStyle = this.options.color;

        let text: any;
        let answer: any;
        switch (this.options.type) {

            case 'number':
                answer = text = Math.random().toString(10).substr(2, this.options.codeLength).toLocaleUpperCase();
                break;

            case 'letter':
                text = "";
                for (var i = 0; i < this.options.codeLength; i++) {
                    text += String.fromCharCode(Math.ceil(Math.random() * 25) + 65).toLocaleUpperCase();
                }
                answer = text;
                break;

            case 'arithmetic':
                switch (Math.ceil(Math.random() * 4)) {
                    //加
                    case 1: {
                        const num1 = Math.floor(Math.random() * 100);
                        const num2 = Math.floor(Math.random() * 100);
                        text = [num1, "+", num2, "="];
                        answer = num1 + num2;
                        break;
                    }
                    //减
                    case 2: {
                        const num1 = Math.floor(Math.random() * 100);
                        const num2 = Math.floor(Math.random() * 100);
                        if (num1 > num2) {
                            text = [num1, "-", num2, "="];
                            answer = num1 - num2;
                        } else {
                            text = [num2, "-", num1, "="];
                            answer = num2 - num1;
                        }
                        break;
                    }
                    //乘
                    case 3: {
                        const num1 = Math.ceil(Math.random() * 20);
                        const num2 = Math.ceil(Math.random() * 9);
                        text = [num1, "×", num2, "="];
                        answer = num1 * num2;

                        break;
                    }
                    //除
                    case 4: {
                        var num1 = Math.ceil(Math.random() * 9);
                        var num2 = Math.ceil(Math.random() * 8 + 1);
                        text = [num1 * num2, "÷", num1, "="];
                        answer = num2;
                        break;
                    }
                }

                this.options.codeLength = 4;
                break;

            default:
                answer = text = Math.random().toString(35).substr(2, this.options.codeLength).toLocaleUpperCase();
        }

        //自定义验证码
        if (this.options.text) {
            answer = text = this.options.text;
        }

        for (i = 0; i < text.length; i++) {
            const transform = new DOMMatrix([Math.random() * 0.5 + 1, Math.random() * 0.4,
                Math.random() * 0.4,
                Math.random() * 0.2 + 1,
                (this.options.canvasWidth / this.options.codeLength) * i + this.options.fontSize / 10,
                this.options.canvasHeight - (this.options.canvasHeight - this.options.fontSize + 16 ) / 2]);
            ctx.setTransform(transform);

            if (typeof text == 'string') {
                ctx.fillText(text.charAt(i), 0, 0);
            } else if (typeof text == 'object') {
                ctx.fillText(text[i], 0, 0);
            }
        }

        return new Promise(function (resolve, reject) {
            canvas.toBuffer(function (err, data) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve({text: text, answer: answer, imageBuffer: data})
                }
            })
        });
    }
}
