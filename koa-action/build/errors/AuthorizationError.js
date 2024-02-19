(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./HttpError"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthorizationError = void 0;
    const HttpError_1 = require("./HttpError");
    class AuthorizationError extends HttpError_1.HttpError {
        constructor(ctx, message) {
            super(401);
            this.name = 'AuthorizationError';
            Object.setPrototypeOf(this, AuthorizationError.prototype);
            const uri = `${ctx.request.method} ${ctx.request.url}`; // todo: check it it works in koa
            this.message = `${message || 'Authorization is expired'} for request on ${uri}`;
        }
    }
    exports.AuthorizationError = AuthorizationError;
});
