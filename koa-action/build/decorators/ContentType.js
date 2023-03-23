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
    exports.ContentType = void 0;
    function ContentType(type) {
        return function (target, key) {
            Reflect.defineMetadata('ccc:content-type', type, target, key);
        };
    }
    exports.ContentType = ContentType;
});
