"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = void 0;
function ContentType(type) {
    return function (target, key) {
        Reflect.defineMetadata('ccc:content-type', type, target, key);
    };
}
exports.ContentType = ContentType;
