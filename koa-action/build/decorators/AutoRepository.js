"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRepository = void 0;
function AutoRepository(Class) {
    return function (target, propertyKey) {
        const { ds } = require("../App");
        target[propertyKey] = ds.getRepository(Class);
    };
}
exports.AutoRepository = AutoRepository;
