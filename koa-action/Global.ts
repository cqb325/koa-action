import { DataSource } from 'typeorm';
import { ConfigOptions } from './types/index.d';
import { Logger } from 'log4js';

export class Global {
    static interceptorsDirectories: string[]
    static config: ConfigOptions
    static beans: Map<any, any> =  new Map();
    static dataSource: DataSource
    static log: Logger
}