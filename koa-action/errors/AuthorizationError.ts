import { HttpError } from "./HttpError";

export class AuthorizationError extends HttpError {
    name = 'AuthorizationError';

    constructor (ctx: any, message?: string) {
        super(403);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
        const uri = `${ctx.request.method} ${ctx.request.url}`; // todo: check it it works in koa
        this.message = `${message || 'Authorization is expired'} for request on ${uri}`;
    }
}