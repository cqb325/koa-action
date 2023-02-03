import { Interceptor } from './Interceptor';
import path from "node:path";
import fs from "node:fs";

export class ScanInterceptor {
    dirs: string[]

    interceptors: Interceptor[] = [];

    constructor (dirs: string[]) {
        this.dirs = dirs;
    }

    scan (): void {
        if (typeof this.dirs === 'string') {
            this.doScanInterceptor(this.dirs);
        } else {
            this.dirs.forEach((cur: string) => {
                this.doScanInterceptor(cur);
            });
        }
    }

    doScanInterceptor (dir: string) {
        let moduleDir:string = path.join(process.cwd(), dir);
        try {
            if(fs.existsSync(moduleDir)){
                const files:string[] = fs.readdirSync(moduleDir);
                files.forEach((file:string)=>{
                    let fileName:string = path.basename(file, path.extname(file));
                    const Module = require(path.resolve(moduleDir, fileName));
                    this.interceptors.push(new Module());
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
}