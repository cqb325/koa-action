"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
function Validate(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:validates', target, key)) {
        Reflect.defineMetadata('ccc:validates', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:validates', target, key);
    fileds[paramIndex] = true;
}
exports.Validate = Validate;
