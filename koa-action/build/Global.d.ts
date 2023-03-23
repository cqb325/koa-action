import { DataSource } from 'typeorm';
import { ConfigOptions } from './types/index.d';
import { Logger } from 'log4js';
export type Aspect = {
    target: any;
    before: Function;
    after: Function;
    around: Function;
    afterReturn: Function;
    afterThrow: Function;
    advice: (target: any, key: any, args: any, aspect: Aspect, customData: any) => Promise<any>;
};
export type PointCut = {
    key: string;
    data?: any;
};
export declare class Global {
    static interceptorsDirectories: string[];
    static aspectsDirectories: string[];
    static config: ConfigOptions;
    static beans: Map<any, any>;
    static dataSource: DataSource;
    static log: Logger;
    static aspects: Map<string, Aspect>;
    static addAopPointCut: (key: string, target: any, method: string, data: any) => void;
}
