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
    exports.Autowired = void 0;
    const Global_1 = require("../Global");
    function Autowired(target, propertyKey) {
        const Type = Reflect.getMetadata('design:type', target, propertyKey);
        target[propertyKey] = (0, Global_1.getBean)(Type);
    }
    exports.Autowired = Autowired;
});
