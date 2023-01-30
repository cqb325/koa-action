"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
function Controller(url) {
    return function (target) {
        Reflect.defineMetadata('ccc:rootPath', url, target);
    };
}
exports.Controller = Controller;
