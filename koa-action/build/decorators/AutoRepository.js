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
    exports.AutoRepository = void 0;
    const Global_1 = require("../Global");
    function AutoRepository(Class) {
        return function (target, propertyKey) {
            if (Global_1.Global.dataSource) {
                target[propertyKey] = Global_1.Global.dataSource.getRepository(Class);
            }
        };
    }
    exports.AutoRepository = AutoRepository;
});
