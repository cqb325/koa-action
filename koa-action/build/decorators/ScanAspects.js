"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanAspects = void 0;
const Global_1 = require("../Global");
function ScanAspects(...urls) {
    Global_1.Global.aspectsDirectories = urls;
    return function (target) {
    };
}
exports.ScanAspects = ScanAspects;
