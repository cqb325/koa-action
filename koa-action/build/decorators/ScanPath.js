"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanPath = void 0;
function ScanPath(...urls) {
    return function (target) {
        Reflect.defineMetadata('ccc:scanDirectories', urls, target.prototype);
    };
}
exports.ScanPath = ScanPath;
