"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const HttpError_1 = require("./HttpError");
class ForbiddenError extends HttpError_1.HttpError {
    constructor(ctx) {
        super(403);
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        const uri = `${ctx.request.method} ${ctx.request.url}`; // todo: check it it works in koa
        this.message = `Authorization is required for request on ${uri}`;
    }
}
exports.ForbiddenError = ForbiddenError;
