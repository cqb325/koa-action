"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTemplate = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const Global_1 = require("../Global");
class RedisTemplate extends ioredis_1.default {
    constructor() {
        super(Global_1.Global.config.redis || {});
    }
}
exports.RedisTemplate = RedisTemplate;
