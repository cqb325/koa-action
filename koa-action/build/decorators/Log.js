var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Global", "log4js", "node:path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Log = void 0;
    const Global_1 = require("../Global");
    const log4js_1 = __importDefault(require("log4js"));
    const node_path_1 = __importDefault(require("node:path"));
    function Log(name) {
        if (!Global_1.Global.log && Global_1.Global.config.logger) {
            const dir = node_path_1.default.dirname(Global_1.Global.config.logger.path);
            log4js_1.default.configure({
                appenders: {
                    [Global_1.Global.config.logger.name]: {
                        type: 'dateFile',
                        numBackups: Global_1.Global.config.logger.numBackups || 15,
                        layout: {
                            type: 'pattern',
                            pattern: Global_1.Global.config.logger.pattern || '[%d{yyyy-MM-dd hh:mm:ss}] [pid:%z] [%p] [%C.%M] %c - %m'
                        },
                        compress: true,
                        filename: Global_1.Global.config.logger.path
                    },
                    'access': {
                        type: 'dateFile',
                        numBackups: 15,
                        layout: {
                            type: 'pattern',
                            pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] - %m'
                        },
                        compress: true,
                        filename: node_path_1.default.resolve(dir, 'access.log')
                    },
                    'accessError': {
                        type: 'dateFile',
                        numBackups: 15,
                        layout: {
                            type: 'pattern',
                            pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] - %m'
                        },
                        compress: true,
                        filename: node_path_1.default.resolve(dir, 'accessError.log')
                    }
                },
                categories: {
                    default: { appenders: [Global_1.Global.config.logger.name], level: Global_1.Global.config.logger.level || 'info', enableCallStack: true },
                    access: { appenders: ['access'], level: 'debug' },
                    accessError: { appenders: ['accessError'], level: 'debug' }
                },
                pm2: Global_1.Global.config.logger.pm2,
                pm2InstanceVar: Global_1.Global.config.logger.pm2InstanceVar
            });
            const logger = log4js_1.default.getLogger(Global_1.Global.config.logger.name);
            Global_1.Global.log = logger;
        }
        return function (target, key) {
            if (name) {
                target[key] = log4js_1.default.getLogger(name);
            }
            else {
                target[key] = Global_1.Global.log;
            }
        };
    }
    exports.Log = Log;
});
