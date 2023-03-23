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
    exports.ScanPath = void 0;
    function ScanPath(...urls) {
        return function (target) {
            Reflect.defineMetadata('ccc:scanDirectories', urls, target.prototype);
        };
    }
    exports.ScanPath = ScanPath;
});
