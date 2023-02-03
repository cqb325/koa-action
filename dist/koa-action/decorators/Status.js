"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
function Status(code) {
    return function (target, key) {
        Reflect.defineMetadata('ccc:status-code', code, target, key);
    };
}
exports.Status = Status;
