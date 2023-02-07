import { DataSourceOptions } from 'typeorm';
export interface Route {
    method: string,
    url: string,
    handler: any
}

declare type RedisOptions = {
    host: string,
    port: number,
    password: string,
    db: number
}

export interface LoggerOptions {
    name: string,
    numBackups?: bumber,
    pattern?: string,
    path: string,
    pm2?: boolean,
    level?: string,
    pm2InstanceVar?: string
}

export interface ConfigOptions {
    serviceName?: string,
    host?: string,
    port: number,
    controllers?: string | string[],
    upload?: string,
    maxFileSize?: number,
    formLimit?: number,
    favicon?: string,
    static?: string,
    dataSource?: DataSourceOptions,
    redisSession: any,
    views?: string,
    redis?: RedisOptions,
    sessionExp?: number = 30,
    logger?: LoggerOptions
}