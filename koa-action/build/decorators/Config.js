"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const Global_1 = require("../Global");
function Config(target, key) {
    if (!Global_1.Global.config) {
        throw new Error('import config to initialize Global.config in the first line');
    }
    target[key] = Global_1.Global.config;
}
exports.Config = Config;
