"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
function Config(uri) {
    return function (target) {
        Reflect.defineMetadata('ccc:configPath', uri, target.prototype);
    };
}
exports.Config = Config;
