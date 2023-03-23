(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpError = void 0;
    class HttpError extends Error {
        constructor(code, message) {
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
    exports.HttpError = HttpError;
});
