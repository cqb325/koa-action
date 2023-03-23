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
    exports.RequestParamInvalidError = void 0;
    const HttpError_1 = require("./HttpError");
    class RequestParamInvalidError extends HttpError_1.HttpError {
        constructor(message) {
            super(400);
            this.name = 'RequestParamInvalidError';
            Object.setPrototypeOf(this, RequestParamInvalidError.prototype);
            this.message = `${message}`;
        }
    }
    exports.RequestParamInvalidError = RequestParamInvalidError;
});
