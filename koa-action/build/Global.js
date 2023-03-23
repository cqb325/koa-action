"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
class Global {
}
exports.Global = Global;
Global.beans = new Map();
Global.aspects = new Map();
Global.addAopPointCut = (key, target, method, data) => {
    if (!Reflect.hasMetadata('ccc:pointcuts', target, method)) {
        Reflect.defineMetadata('ccc:pointcuts', [], target, method);
    }
    const pointcuts = Reflect.getMetadata('ccc:pointcuts', target, method);
    pointcuts.push({
        key,
        data
    });
};
