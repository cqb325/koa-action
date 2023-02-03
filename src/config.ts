import { Global } from "../koa-action/Global";

Global.config = {
    serviceName: 'fqbdService',
    port: 18080,
    dataSource: {
        type: "mysql",
        host: "172.21.46.186",
        port: 3306,
        username: "speedtest",
        password: "cmcc2021",
        database: "fqbd",
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
        sessionOptions: {
            key: 'ka.sid',
            ttl: 5 * 60 * 1000  // 5分钟
        },
        redisOptions: {
            db: 2,
        }
    }
};