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
    exports.Auth = void 0;
    function Auth(target, key, paramIndex) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'auth',
            index: paramIndex
        };
    }
    exports.Auth = Auth;
    ;
});
