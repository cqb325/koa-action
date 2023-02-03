"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autowired = void 0;
function Autowired(target, propertyKey) {
    const Type = Reflect.getMetadata('design:type', target, propertyKey);
    target[propertyKey] = new Type();
}
exports.Autowired = Autowired;
