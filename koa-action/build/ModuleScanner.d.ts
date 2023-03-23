import { Logger } from 'log4js';
/**
 * 模块扫描和加载
 */
export declare class ModuleScanner {
    root: string;
    dirs: string[];
    handler: Function;
    log: Logger;
    constructor(root: string, dirs: string[], handler: Function);
    /**
     * 逐级扫描目录加载模块
     */
    scan(): void;
    private _doScan;
}
