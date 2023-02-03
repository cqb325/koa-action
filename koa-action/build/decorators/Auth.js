"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
function Auth(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'auth',
        index: paramIndex
    };
}
exports.Auth = Auth;
;
