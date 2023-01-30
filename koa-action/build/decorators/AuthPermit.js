"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPermit = void 0;
function AuthPermit(target, propertyKey) {
    Reflect.defineMetadata('ccc:authorizePermit', true, target, propertyKey);
}
exports.AuthPermit = AuthPermit;
