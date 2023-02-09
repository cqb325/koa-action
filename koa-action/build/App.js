"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaAction = void 0;
const HttpError_1 = require("./errors/HttpError");
const ScanRouter_1 = require("./ScanRouter");
const koa_body_1 = __importDefault(require("koa-body"));
const DefaultDataResponse_1 = require("./DefaultDataResponse");
const typeorm_1 = require("typeorm");
const Global_1 = require("./Global");
const decorators_1 = require("./decorators");
const ModuleScanner_1 = require("./ModuleScanner");
const node_path_1 = __importDefault(require("node:path"));
const koa_1 = __importDefault(require("koa"));
class KoaAction {
    constructor(options = {}) {
        this.options = options;
        this.interceptors = [];
        this.options = options;
        this.koa = new koa_1.default();
        this._init();
    }
    /**
     * 初始化
     * @return {[type]} [description]
     */
    _init() {
        //初始化错误处理
        this._initErrors();
        // 加载中间件
        this._loadMiddlewares();
        // 初始化数据库
        this._registerDataSource();
        // 初始化切面
        this._scanAspects();
    }
    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    _initErrors() {
        // 监控错误日志
        this.koa.on('error', (err, ctx) => {
            // utils.log(err);
            console.error(err);
            this.logger.error(err);
        });
        // 捕获promise reject错误
        process.on('unhandledRejection', (reason) => {
            // utils.log(reason);
            console.error(reason);
            this.logger.error(reason);
        });
        // 捕获未知错误
        process.on('uncaughtException', (err) => {
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
    initRouters() {
        this.koa.use(this.router.routes()).use(this.router.allowedMethods());
    }
    /**
     * 加载基础中间件
     */
    _loadMiddlewares() {
        let root = process.cwd();
        this.use(async (ctx, next) => {
            await next();
            const { url, ip, status, method, host, hostname, protocol } = ctx;
            if (parseInt(status) >= 300) {
                this.accessErrorLog.error(`${url} | ${ip} | ${method} | ${status} | ${host} | ${hostname} | ${protocol}`);
            }
            else {
                this.accessLog.info(`${url} | ${ip} | ${method} | ${status} | ${host} | ${hostname} | ${protocol}`);
            }
        });
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
        }, () => {
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
    use(fn) {
        this.koa.use(fn);
        return this;
    }
    /**
     * 注册controllers
     */
    registerControllers() {
        this.logger.debug('use koabody ');
        this.koaBody = (0, koa_body_1.default)({
            multipart: true,
            formidable: {
                uploadDir: this.config.upload,
                keepExtensions: true,
                maxFileSize: this.config.maxFileSize
            },
            formLimit: this.config.formLimit
        });
        this.logger.debug(`route prefix /${this.config.serviceName || ''}`);
        this.router = new ScanRouter_1.Router(this, {
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
    registerInterceptor(interceptor) {
        this.logger.debug(`add interceptor ${interceptor}`);
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
            this.logger.error(`[HttpError] ${error}`);
            ctx.status = error.code;
            ctx.body = DefaultDataResponse_1.DefaultDataResponse.failWithCodeMessage(error.code, error.message || error.stack);
        }
        else {
            console.log('normal Error...', error);
            this.logger.error(`[NormalError] ${error}`);
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
    async _registerDataSource(options) {
        if (options) {
            this.logger.debug(`datasource config ${options}`);
            this.dataSource = new typeorm_1.DataSource(options);
        }
        else {
            const dsConfig = this.config.dataSource;
            if (dsConfig) {
                this.logger.debug(`datasource config ${dsConfig}`);
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
            const scanner = new ModuleScanner_1.ModuleScanner(process.cwd(), dirs, (interceptorModule) => {
                this.registerInterceptor(interceptorModule);
            });
            scanner.scan();
        }
        return this;
    }
    /**
     * 处理切面
     */
    _scanAspects() {
        if (Global_1.Global.aspectsDirectories && Global_1.Global.aspectsDirectories.length) {
            let dirs = Global_1.Global.aspectsDirectories;
            const aspectsScanner = new ModuleScanner_1.ModuleScanner(process.cwd(), dirs, () => { });
            aspectsScanner.scan();
        }
        return this;
    }
}
__decorate([
    decorators_1.Config,
    __metadata("design:type", Object)
], KoaAction.prototype, "config", void 0);
__decorate([
    (0, decorators_1.Log)(),
    __metadata("design:type", Object)
], KoaAction.prototype, "logger", void 0);
__decorate([
    (0, decorators_1.Log)('access'),
    __metadata("design:type", Object)
], KoaAction.prototype, "accessLog", void 0);
__decorate([
    (0, decorators_1.Log)('accessError'),
    __metadata("design:type", Object)
], KoaAction.prototype, "accessErrorLog", void 0);
exports.KoaAction = KoaAction;
