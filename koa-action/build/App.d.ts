import { ConfigOptions } from './types/index';
import { Interceptor } from './Interceptor';
import { DataSource } from 'typeorm';
import { Logger } from 'log4js';
export declare class KoaAction {
    options: any;
    koa: any;
    router: any;
    interceptors: Interceptor[];
    koaBody: any;
    dataSource: DataSource;
    config: ConfigOptions;
    logger: Logger;
    accessLog: Logger;
    accessErrorLog: Logger;
    constructor(options?: any);
    /**
     * 初始化
     * @return {[type]} [description]
     */
    private _init;
    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    private _initErrors;
    /**
     * 初始化路由
     * @return {[type]} [description]
     */
    initRouters(): void;
    /**
     * 加载基础中间件
     */
    private _loadMiddlewares;
    /**
     * 运行
     * @return {[type]} [description]
     */
    run(callback?: Function): void;
    /**
     * 使用中间件
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    use(fn: Function): any;
    /**
     * 注册controllers
     */
    registerControllers(): void;
    /**
     * 添加拦截器
     * @param interceptor
     * @returns
     */
    registerInterceptor(interceptor: Interceptor): any;
    /**
     * 统一处理错误
     * @param error
     * @param ctx
     */
    private handlerError;
    /**
     * 获取拦截器
     * @returns
     */
    getInterceptors(): ((ctx: any, next: any) => Promise<void>)[];
    /**
     * 注册数据源
     * @param options
     */
    private _registerDataSource;
    /**
     * 扫描拦截器
     * @returns
     */
    private scanInterceptors;
    /**
     * 处理切面
     */
    private _scanAspects;
}
