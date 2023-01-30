export class HttpError extends Error{
    code: number

    constructor(code: number, message?: string) {
        super();
        Object.setPrototypeOf(this, HttpError.prototype);
        if (code) {
            this.code = code;
        }
        if (message) {
            this.message = message;
        }
        this.stack = new Error().stack;
    }
}