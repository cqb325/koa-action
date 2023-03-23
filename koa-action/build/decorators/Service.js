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
    exports.Service = void 0;
    const Global_1 = require("../Global");
    function Service(target, propertyKey) {
        const Type = Reflect.getMetadata('design:type', target, propertyKey);
        if (!Global_1.Global.beans.has(Type)) {
            Global_1.Global.beans.set(Type, new Type());
        }
        target[propertyKey] = Global_1.Global.beans.get(Type);
    }
    exports.Service = Service;
});
