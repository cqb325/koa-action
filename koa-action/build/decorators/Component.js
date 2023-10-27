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
    exports.Component = void 0;
    const Global_1 = require("../Global");
    /**
     * 标识类进行注册对象
     * @param Type
     */
    function Component(Type) {
        (0, Global_1.registerBean)(Type, new Type());
    }
    exports.Component = Component;
});
