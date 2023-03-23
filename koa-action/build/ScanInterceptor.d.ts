import { Interceptor } from './Interceptor';
export declare class ScanInterceptor {
    dirs: string[];
    interceptors: Interceptor[];
    constructor(dirs: string[]);
    scan(): void;
    doScanInterceptor(dir: string): void;
}
