import { ScanInterceptor } from './ScanInterceptor';
import { HttpError } from './errors/HttpError';
import { Router } from './ScanRouter';
import { ConfigOptions } from './types/index';
import KoaBody from 'koa-body';
import { Interceptor } from './Interceptor';
import { DefaultDataResponse } from './DefaultDataResponse';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Global } from "./Global";
import { Log, Config } from "./decorators";
import { Logger } from 'log4js';
import path from 'node:path';
import Koa from 'koa';

export class KoaAction {
    public koa: any
    public router: any
    interceptors: Interceptor[] = [];
    koaBody: any
    dataSource: DataSource
    @Config
    config: ConfigOptions
    @Log()
    logger: Logger
    @Log('access')
    accessLog: Logger
    @Log('accessError')
    accessErrorLog: Logger

    constructor(public options:any = {}){
        this.options = options;
        this.koa = new Koa();
        this._init();
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */
    private _init(): void {
        //初始化错误处理
        this._initErrors();
        // 加载中间件
        this._loadMiddlewares();
        // 初始化数据库
        this._registerDataSource();
    }

    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    private _initErrors(): void {
        // 监控错误日志
        this.koa.on('error', (err: Error, ctx: any) => {
            // utils.log(err);
            console.error(err);
            this.logger.error(err);
        });

        // 捕获promise reject错误
        process.on('unhandledRejection', (reason: string)=> {
            // utils.log(reason);
            console.error(reason);
            this.logger.error(reason);
        });

        // 捕获未知错误
        process.on('uncaughtException', (err: Error) => {
            // utils.log(err);
            console.error(err);
            this.logger.error(err);
            if (err.message.indexOf(' EADDRINUSE ') > -1) {
                process.exit();
            }
        });
    }

    /**
     * 初始化路由
     * @return {[type]} [description]
     */
    initRouters(): void {
        this.koa.use(this.router.routes()).use(this.router.allowedMethods());
    }

    /**
     * 加载基础中间件
     */
    private _loadMiddlewares () {
        let root = process.cwd();

        this.use(async (ctx: any, next: any) => {
            const {url, ip, status, method, host, hostname, protocol} = ctx;
            await next();
            this.accessLog.info(`${url} | ${ip} | ${method} | ${status} | ${host} | ${hostname} | ${protocol}`);
        });

        //favicon
        if (this.config.favicon) {
            const favicon = require('koa-favicon');
            this.koa.use(favicon(path.resolve(root , this.config.favicon)));
        }

        //static
        if (this.config.static) {
            const koaStatic = require('koa-static');
            this.koa.use(koaStatic(path.resolve(root , this.config.static)));
        }

        //compress
        const compress = require('koa-compress');
        this.koa.use(compress({
            flush: require('zlib').constants.Z_SYNC_FLUSH
        }));

        // session
        if (this.config.redisSession) {
            this.koa.keys = ['koa-action', 'koa2'];
            const session = require('koa-generic-session');
            const redisStore = require('koa-redis');

            const ops = this.config.redisSession.sessionOptions || {};
            ops.store = redisStore(this.config.redisSession.redisOptions || {});
            
            this.use(session(ops));
        }

        // views
        if (this.config.views) {
            const ejsRender = require('@koa/ejs');
            ejsRender(this.koa, {
                root: path.join(process.cwd(), this.config.views),
                layout: false,
                viewExt: 'html',
                cache: false,
                debug: false
            });
        }
    }

    /**
     * 运行
     * @return {[type]} [description]
     */
    run(callback?: Function): void {
        this.logger.debug('start register controllers');
        this.registerControllers();
        this.logger.debug('start scan interceptors');
        this.scanInterceptors();
        //初始化路由
        this.initRouters();

        const host = this.config.host || '0.0.0.0';
        this.koa.listen({
            host: host,
            port: this.config.port
        },()=>{
            if (callback) {
                callback.apply(this, arguments);
            }
            this.logger.debug('server listen on ' + host + ":" + this.config.port);
            console.log("server listen on " + host + ":" + this.config.port);
        });
    }

    /**
     * 使用中间件
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    use(fn: Function): any {
        this.koa.use(fn);
        return this;
    }

    /**
     * 注册controllers
     */
    registerControllers () {
        this.logger.debug('use koabody ');
        this.koaBody = KoaBody({
            multipart: true,
            formidable: {
                uploadDir: this.config.upload,
                keepExtensions: true,
                maxFileSize: this.config.maxFileSize
            },
            formLimit: this.config.formLimit
        });
        this.logger.debug(`route prefix /${this.config.serviceName || ''}`);
        this.router = new Router(this, {
            prefix: `/${this.config.serviceName || ''}`
        });

        if (!Reflect.hasMetadata('ccc:scanDirectories', this)) {
            this.logger.error('starting App class needs to use @ScanPath to specify the controllers directories');
            throw new Error('starting App class needs to use @ScanPath to specify the controllers directories');
        }
        const dirs = Reflect.getMetadata('ccc:scanDirectories', this);
        this.logger.debug(`controllers directors ${dirs}`);
        this.router.scan(dirs);
    }

    /**
     * 添加拦截器
     * @param interceptor 
     * @returns 
     */
    registerInterceptor(interceptor: Interceptor): any {
        this.logger.debug(`add interceptor ${interceptor}`);
        this.interceptors.push(interceptor);
        return this;
    }

    /**
     * 统一处理错误
     * @param error 
     * @param ctx 
     */
    private handlerError (error: any, ctx: any) {
        if (error instanceof HttpError) {
            console.log('httpError...', error);
            this.logger.error(`[HttpError] ${error}`);
            ctx.status = error.code;
            ctx.body = DefaultDataResponse.failWithCodeMessage(error.code, error.message || error.stack);
        } else {
            console.log('normal Error...', error);
            this.logger.error(`[NormalError] ${error}`);
            let statusCode = error.status || error.statusCode || 500;
            ctx.status = statusCode;
            ctx.body = DefaultDataResponse.failWithCodeMessage(statusCode, error.message || error.stack);
        }
    }

    /**
     * 获取拦截器
     * @returns 
     */
    getInterceptors () {
        return this.interceptors.map(interceptor => {
            return async (ctx: any, next: any) => {
                try {
                    const ret = await interceptor.preHandle(ctx);
                    if (ret) {
                        await next();
                    }
                    await interceptor.afterHandle(ctx);
                } catch (err: any) {
                    this.handlerError(err, ctx);
                }
            }
        });
    }

    /**
     * 注册数据源
     * @param options 
     */
    private async _registerDataSource (options?: DataSourceOptions) {
        if (options) {
            this.logger.debug(`datasource config ${options}`);
            this.dataSource = new DataSource(options);
        } else {
            const dsConfig = this.config.dataSource;
            if (dsConfig) {
                this.logger.debug(`datasource config ${dsConfig}`);
                this.dataSource = new DataSource(dsConfig);
            }
        }
        Global.dataSource = this.dataSource;
        await this.dataSource.initialize();
        return this;
    }

    /**
     * 扫描拦截器
     * @returns 
     */
    private scanInterceptors () {
        if (Global.interceptorsDirectories && Global.interceptorsDirectories.length) {
            let dirs = Global.interceptorsDirectories;
            const scanor = new ScanInterceptor(dirs);
            scanor.scan();

            scanor.interceptors.forEach(interceptorModule => {
                this.registerInterceptor(interceptorModule);
            });
        }
        return this;
    }
}