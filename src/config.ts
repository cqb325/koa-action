import { Global } from "../koa-action/Global";
import path from "node:path";

Global.config = {
    serviceName: 'test',
    port: 18080,
    upload: 'uploads',
    dataSource: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "123456",
        database: "test",
        entities: ['src/**/*.entity{.js,.ts}'],
        synchronize: false,
        logger: undefined, // 'advanced-console',
        logging: false //'all',
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: 2
    },
    redisSession: {
        key: 'ka.sid',
        ttl: 5 * 60 * 1000  // 5分钟
    },
    logger: {
        name: 'test',
        numBackups: 15,
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [pid:%z] [%p] [%C.%M] %c - %m',
        path: path.resolve(process.cwd(), 'logs', 'logs.log'),
        level: 'info',
        pm2: true,
        pm2InstanceVar: 'INSTANCE_ID'
    }
};