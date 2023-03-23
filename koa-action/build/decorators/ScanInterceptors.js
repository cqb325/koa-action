(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Global"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScanInterceptors = void 0;
    const Global_1 = require("../Global");
    function ScanInterceptors(...urls) {
        Global_1.Global.interceptorsDirectories = urls;
        return function (target) {
        };
    }
    exports.ScanInterceptors = ScanInterceptors;
});
