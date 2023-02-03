"use strict";
module.exports = {
    port: 50000,
    dataSource: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "123456",
        database: "test",
        entities: ['src/**/*.entity{.js,.ts}'],
        synchronize: false,
        logger: 'advanced-console',
        logging: 'all',
    },
    redisSession: {
        sessionOptions: {
            key: 'ka.sid',
            ttl: 5 * 60 * 1000 // 5分钟
        },
        redisOptions: {
            db: 2,
        }
    }
};
