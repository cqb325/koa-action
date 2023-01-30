import { DataSourceOptions } from 'typeorm';
export interface Route {
    method: string,
    url: string,
    handler: any
}

export interface ConfigOptions {
    port: number,
    controllers: string | string[],
    upload: string,
    maxFileSize: number,
    formLimit: number,
    favicon: string,
    static: string,
    dataSource: DataSourceOptions,
    redisSession: any,
    views: string
}