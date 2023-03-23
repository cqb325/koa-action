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
    exports.Authorization = void 0;
    class Authorization {
        setData(data) {
            this.data = data;
        }
        getData() {
            return this.data;
        }
        setPermits(permits) {
            this.permits = permits;
        }
        setAuthorized(authorized) {
            this.authorized = authorized;
        }
        isAuthorized() {
            return this.authorized;
        }
    }
    exports.Authorization = Authorization;
});
