import { DataSource } from 'typeorm';
import { ConfigOptions } from './types/index.d';
import { Logger } from 'log4js';

export type Aspect = {
    target: any,
    before: Function,
    after: Function,
    around: Function,
    afterReturn: Function,
    afterThrow: Function,
    advice: (target: any, key: any, args: any, aspect: Aspect, customData: any) => Promise<any>
}
export type PointCut = {
    key: string,
    data?: any
}

export class Global {
    static interceptorsDirectories: string[]
    static aspectsDirectories: string[]
    static config: ConfigOptions
    static beans: Map<any, any> =  new Map();
    static dataSource: DataSource
    static log: Logger;
    static aspects: Map<string, Aspect> = new Map();
    static addAopPointCut = (key: string, target: any, method: string, data: any) => {
        if (!Reflect.hasMetadata('ccc:pointcuts', target, method)) {
            Reflect.defineMetadata('ccc:pointcuts', [], target, method);
        }
        const pointcuts = Reflect.getMetadata('ccc:pointcuts', target, method);
        pointcuts.push({
            key,
            data
        } as PointCut);
    }
}