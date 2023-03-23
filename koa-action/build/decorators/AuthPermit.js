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
    exports.AuthPermit = void 0;
    function AuthPermit(target, propertyKey) {
        Reflect.defineMetadata('ccc:authorizePermit', true, target, propertyKey);
    }
    exports.AuthPermit = AuthPermit;
});
