import { HttpError } from './errors/HttpError';
import { Router } from './ScanRouter';
import { ConfigOptions } from './types/index';
import KoaBody from 'koa-body';
import { Interceptor } from './Interceptor';
import { DefaultDataResponse } from './DefaultDataResponse';
import { DataSource, DataSourceOptions } from 'typeorm';
import Koa from 'koa';
import path from 'node:path';

export let ds:DataSource;
export class KoaAction {
    public koa: any
    public router: any
    interceptors: Interceptor[] = [];
    koaBody: any
    config: ConfigOptions
    dataSource: DataSource

    constructor(public options:any = {}){
        this.options = options;
        this.koa = new Koa();
        this.init();
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */
    init(): void {
        const configUri = Reflect.getMetadata('ccc:configPath', this);
        if (!Reflect.hasMetadata('ccc:configPath', this)) {
            throw new Error('starting App class needs to use @Config to specify the config file');
        }
        this.config = require(path.resolve(process.cwd(), configUri));
        //初始化错误处理
        this.initErrors();
        //初始化数据库
        this.loadMiddlewares();
    }

    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    initErrors(): void {
        // 监控错误日志
        this.koa.on('error', function (err: Error, ctx: any) {
            // utils.log(err);
            console.error(err);
        });

        // 捕获promise reject错误
        process.on('unhandledRejection', (reason: string)=> {
            // utils.log(reason);
            console.error(reason);
        });

        // 捕获未知错误
        process.on('uncaughtException', function (err: Error) {
            // utils.log(err);
            console.error(err);
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
    loadMiddlewares () {
        let root = process.cwd();
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

        if (this.config.redisSession) {
            this.koa.keys = ['koa-action', 'koa2'];
            const session = require('koa-generic-session');
            const redisStore = require('koa-redis');

            const ops = this.config.redisSession.sessionOptions || {};
            ops.store = redisStore(this.config.redisSession.redisOptions || {});
            
            this.use(session(ops));
        }
    }

    /**
     * 运行
     * @return {[type]} [description]
     */
    run(callback?: Function): void {
        this.registerControllers();
        //初始化路由
        this.initRouters();

        this.koa.listen(this.config.port,()=>{
            if (callback) {
                callback.apply(this, arguments);
            }
            console.log("server listen on " + this.config.port);
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
        this.koaBody = KoaBody({
            multipart: true,
            formidable: {
                uploadDir: this.config.upload,
                keepExtensions: true,
                maxFileSize: this.config.maxFileSize
            },
            formLimit: this.config.formLimit
        });
        this.router = new Router(this);
        if (!Reflect.hasMetadata('ccc:scanDirectories', this)) {
            throw new Error('starting App class needs to use @ScanPath to specify the controllers directories');
        }
        const dirs = Reflect.getMetadata('ccc:scanDirectories', this);
        this.router.scan(dirs);
    }

    /**
     * 添加拦截器
     * @param interceptor 
     * @returns 
     */
    registerInterceptor(interceptor: Interceptor): any {
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
            console.log('httpError...');
            ctx.status = error.code;
            ctx.body = DefaultDataResponse.failWithCodeMessage(error.code, error.message || error.stack);
        } else {
            console.log('normal Error...', error);
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
    async registerDataSource (options?: DataSourceOptions) {
        if (options) {
            this.dataSource = new DataSource(options);
        } else {
            this.dataSource = new DataSource(this.config.dataSource);
        }
        ds = this.dataSource;
        await this.dataSource.initialize();
        return this;
    }
}