import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
    name = 'ForbiddenError';

    constructor (ctx: any) {
        super(403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        const uri = `${ctx.request.method} ${ctx.request.url}`; // todo: check it it works in koa
        this.message = `Authorization is required for request on ${uri}`;
    }
}