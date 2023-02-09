import { Global } from "../Global";
import log4js from "log4js";
import path from 'node:path';

export function Log(name?: string): PropertyDecorator {
    if (!Global.log && Global.config.logger) {
        const dir = path.dirname(Global.config.logger.path);
        log4js.configure({
            appenders: {
                [Global.config.logger.name]: {
                    type: 'dateFile',
                    numBackups: Global.config.logger.numBackups || 15,
                    layout: {
                        type: 'pattern',
                        pattern: Global.config.logger.pattern || '[%d{yyyy-MM-dd hh:mm:ss}] [pid:%z] [%p] [%C.%M] %c - %m'
                    },
                    compress: true,
                    filename: Global.config.logger.path
                },
                'access': {
                    type: 'dateFile',
                    numBackups: 15,
                    layout: {
                        type: 'pattern',
                        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] - %m'
                    },
                    compress: true,
                    filename: path.resolve(dir, 'access.log')
                },
                'accessError': {
                    type: 'dateFile',
                    numBackups: 15,
                    layout: {
                        type: 'pattern',
                        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] - %m'
                    },
                    compress: true,
                    filename: path.resolve(dir, 'accessError.log')
                }
            },
            categories: {
                default: { appenders: [Global.config.logger.name], level: Global.config.logger.level || 'info', enableCallStack: true },
                access: { appenders: ['access'], level: 'debug'},
                accessError: { appenders: ['accessError'], level: 'debug'}
            },
            pm2: Global.config.logger.pm2,
            pm2InstanceVar: Global.config.logger.pm2InstanceVar
        });
        const logger = log4js.getLogger(Global.config.logger.name);
        Global.log = logger;
    }
    return function (target: any, key: any) {
        if (name) {
            target[key] = log4js.getLogger(name);
        } else {
            target[key] = Global.log;
        }
    }
}