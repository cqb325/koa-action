"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanInterceptors = void 0;
const Global_1 = require("../Global");
function ScanInterceptors(...urls) {
    Global_1.Global.interceptorsDirectories = urls;
    return function (target) {
    };
}
exports.ScanInterceptors = ScanInterceptors;
