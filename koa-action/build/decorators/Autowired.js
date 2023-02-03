"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autowired = void 0;
const Global_1 = require("../Global");
function Autowired(target, propertyKey) {
    const Type = Reflect.getMetadata('design:type', target, propertyKey);
    if (!Global_1.Global.beans.has(Type)) {
        Global_1.Global.beans.set(Type, new Type());
    }
    target[propertyKey] = Global_1.Global.beans.get(Type);
}
exports.Autowired = Autowired;
