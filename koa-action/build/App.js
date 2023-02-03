"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaAction = void 0;
const ScanInterceptor_1 = require("./ScanInterceptor");
const HttpError_1 = require("./errors/HttpError");
const ScanRouter_1 = require("./ScanRouter");
const koa_body_1 = __importDefault(require("koa-body"));
const DefaultDataResponse_1 = require("./DefaultDataResponse");
const typeorm_1 = require("typeorm");
const Global_1 = require("./Global");
const koa_1 = __importDefault(require("koa"));
const node_path_1 = __importDefault(require("node:path"));
class KoaAction {
    constructor(options = {}) {
        this.options = options;
        this.interceptors = [];
        this.options = options;
        this.koa = new koa_1.default();
        this.init();
    }
    /**
     * 初始化
     * @return {[type]} [description]
     */
    init() {
        if (!Global_1.Global.config) {
            throw new Error('import config to initialize Global.config in the first line');
        }
        this.config = Global_1.Global.config;
        //初始化错误处理
        this.initErrors();
        // 加载中间件
        this.loadMiddlewares();
        // 初始化数据库
        this.registerDataSource();
    }
    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    initErrors() {
        // 监控错误日志
        this.koa.on('error', function (err, ctx) {
            // utils.log(err);
            console.error(err);
        });
        // 捕获promise reject错误
        process.on('unhandledRejection', (reason) => {
            // utils.log(reason);
            console.error(reason);
        });
        // 捕获未知错误
        process.on('uncaughtException', function (err) {
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
    initRouters() {
        this.koa.use(this.router.routes()).use(this.router.allowedMethods());
    }
    /**
     * 加载基础中间件
     */
    loadMiddlewares() {
        let root = process.cwd();
        //favicon
        if (this.config.favicon) {
            const favicon = require('koa-favicon');
            this.koa.use(favicon(node_path_1.default.resolve(root, this.config.favicon)));
        }
        //static
        if (this.config.static) {
            const koaStatic = require('koa-static');
            this.koa.use(koaStatic(node_path_1.default.resolve(root, this.config.static)));
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
                root: node_path_1.default.join(process.cwd(), this.config.views),
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
    run(callback) {
        this.registerControllers();
        this.scanInterceptors();
        //初始化路由
        this.initRouters();
        this.koa.listen({
            host: this.config.host || '0.0.0.0',
            port: this.config.port
        }, () => {
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
    use(fn) {
        this.koa.use(fn);
        return this;
    }
    /**
     * 注册controllers
     */
    registerControllers() {
        this.koaBody = (0, koa_body_1.default)({
            multipart: true,
            formidable: {
                uploadDir: this.config.upload,
                keepExtensions: true,
                maxFileSize: this.config.maxFileSize
            },
            formLimit: this.config.formLimit
        });
        this.router = new ScanRouter_1.Router(this, {
            prefix: `/${this.config.serviceName || ''}`
        });
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
    registerInterceptor(interceptor) {
        this.interceptors.push(interceptor);
        return this;
    }
    /**
     * 统一处理错误
     * @param error
     * @param ctx
     */
    handlerError(error, ctx) {
        if (error instanceof HttpError_1.HttpError) {
            console.log('httpError...', error);
            ctx.status = error.code;
            ctx.body = DefaultDataResponse_1.DefaultDataResponse.failWithCodeMessage(error.code, error.message || error.stack);
        }
        else {
            console.log('normal Error...', error);
            let statusCode = error.status || error.statusCode || 500;
            ctx.status = statusCode;
            ctx.body = DefaultDataResponse_1.DefaultDataResponse.failWithCodeMessage(statusCode, error.message || error.stack);
        }
    }
    /**
     * 获取拦截器
     * @returns
     */
    getInterceptors() {
        return this.interceptors.map(interceptor => {
            return async (ctx, next) => {
                try {
                    const ret = await interceptor.preHandle(ctx);
                    if (ret) {
                        await next();
                    }
                    await interceptor.afterHandle(ctx);
                }
                catch (err) {
                    this.handlerError(err, ctx);
                }
            };
        });
    }
    /**
     * 注册数据源
     * @param options
     */
    async registerDataSource(options) {
        if (options) {
            this.dataSource = new typeorm_1.DataSource(options);
        }
        else {
            const dsConfig = this.config.dataSource;
            if (dsConfig) {
                this.dataSource = new typeorm_1.DataSource(dsConfig);
            }
        }
        Global_1.Global.dataSource = this.dataSource;
        await this.dataSource.initialize();
        return this;
    }
    /**
     * 扫描拦截器
     * @returns
     */
    scanInterceptors() {
        if (Global_1.Global.interceptorsDirectories && Global_1.Global.interceptorsDirectories.length) {
            let dirs = Global_1.Global.interceptorsDirectories;
            const scanor = new ScanInterceptor_1.ScanInterceptor(dirs);
            scanor.scan();
            scanor.interceptors.forEach(interceptorModule => {
                this.registerInterceptor(interceptorModule);
            });
        }
        return this;
    }
}
exports.KoaAction = KoaAction;
