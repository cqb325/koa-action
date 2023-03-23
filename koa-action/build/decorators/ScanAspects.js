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
    exports.ScanAspects = void 0;
    const Global_1 = require("../Global");
    function ScanAspects(...urls) {
        Global_1.Global.aspectsDirectories = urls;
        return function (target) {
        };
    }
    exports.ScanAspects = ScanAspects;
});
