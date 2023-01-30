"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
function Service(target, propertyKey) {
    const Type = Reflect.getMetadata('design:type', target, propertyKey);
    target[propertyKey] = new Type();
}
exports.Service = Service;
