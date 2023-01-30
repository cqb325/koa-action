import { HttpError } from "./HttpError";

export class RequestParamInvalidError extends HttpError {
    name = 'RequestParamInvalidError';

    constructor (message?: string) {
        super(400);
        Object.setPrototypeOf(this, RequestParamInvalidError.prototype);
        this.message = `${message}`;
    }
}