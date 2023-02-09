import { Logger } from 'log4js';
import { Log } from './decorators';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 模块扫描和加载
 */
export class ModuleScanner {
    root: string;
    dirs: string[];
    handler: Function;
    
    @Log()
    log: Logger

    constructor (root: string, dirs: string[], handler: Function) {
        this.root = root;
        this.dirs = dirs;
        this.handler = handler;
    }

    /**
     * 逐级扫描目录加载模块
     */
    scan (): void {
        this._doScan(this.dirs, '');
    }

    private _doScan (dirs: string[], parent: string) {
        dirs.forEach((cur: string) => {
            const curPath = path.resolve(this.root, parent, cur);
            if (fs.existsSync(curPath)) {
                const stat = fs.statSync(curPath);
                if (stat.isFile()) {
                    let fileName:string = path.basename(curPath, path.extname(curPath));
                    this.log.debug(`start load module ${curPath}`);
                    const module = require(curPath);
                    const Clazz = module.default || module;
                    this.handler && this.handler(Clazz, fileName);
                } else {
                    const files:string[] = fs.readdirSync(curPath);
                    this._doScan(files, cur);
                }
            } else {
                this.log.warn(`cannt load module ${curPath} path is not exit`);
            }
        });
    }
}