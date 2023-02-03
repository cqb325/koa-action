"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const ForbiddenError_1 = require("./errors/ForbiddenError");
const RequestParamInvalidError_1 = require("./errors/RequestParamInvalidError");
const KoaRouter = require('@koa/router');
class Router extends KoaRouter {
    constructor(app, ops) {
        super(ops);
        this.app = app;
    }
    scan(scanDir) {
        let dirs;
        if (scanDir) {
            dirs = scanDir;
        }
        else {
            dirs = this.app.config.controllers;
        }
        if (typeof dirs === 'string') {
            this.doScanControllers(dirs, this);
        }
        else {
            dirs.forEach((cur) => {
                this.doScanControllers(cur, this);
            });
        }
    }
    checkAuthPermit(ctx, target, handler) {
        var _a;
        const authorizePermit = Reflect.getMetadata('ccc:authorizePermit', target, handler);
        if (authorizePermit) {
            return true;
        }
        return (_a = ctx.auth) === null || _a === void 0 ? void 0 : _a.isAuthorized();
    }
    /**
     * 构建参数
     * @param ctx
     * @param target
     * @param fileds
     */
    buildHandleArguments(ctx, target, fileds) {
        const args = [];
        if (fileds && fileds.length) {
            fileds.forEach((field) => {
                if (field.type === 'param') {
                    args[field.index] = ctx.request.query[field.name];
                }
                if (field.type === 'req') {
                    args[field.index] = ctx.req;
                }
                if (field.type === 'res') {
                    args[field.index] = ctx.res;
                }
                if (field.type === 'headers') {
                    args[field.index] = ctx.headers;
                }
                if (field.type === 'body') {
                    args[field.index] = (0, class_transformer_1.plainToClass)(field.Class, ctx.request.body);
                }
                if (field.type === 'ctx') {
                    args[field.index] = ctx;
                }
                if (field.type === 'cookie') {
                    args[field.index] = ctx.cookies[field.name];
                }
                if (field.type === 'cookies') {
                    args[field.index] = ctx.cookies;
                }
                if (field.type === 'session') {
                    args[field.index] = ctx.session;
                }
                if (field.type === 'sessionParam') {
                    args[field.index] = ctx.session[field.name];
                }
                if (field.type === 'auth') {
                    args[field.index] = ctx.auth;
                }
            });
        }
        return args;
    }
    /**
     * 校验字段
     * @param vals
     * @param validates
     */
    async validateFields(vals, validates) {
        if (validates && validates.length) {
            for (let i = 0; i < validates.length; i++) {
                // 需要进行校验
                if (validates[i]) {
                    const errs = await (0, class_validator_1.validate)(vals[i]);
                    if (errs.length) {
                        const ret = errs.map(err => {
                            return err.constraints;
                        });
                        throw new RequestParamInvalidError_1.RequestParamInvalidError(JSON.stringify(ret));
                    }
                }
            }
        }
    }
    doScanControllers(dir, router) {
        let routerDir = node_path_1.default.join(process.cwd(), dir);
        try {
            if (node_fs_1.default.existsSync(routerDir)) {
                const files = node_fs_1.default.readdirSync(routerDir);
                files.forEach((file) => {
                    let fileName = node_path_1.default.basename(file, node_path_1.default.extname(file));
                    const module = require(node_path_1.default.resolve(routerDir, fileName));
                    const Clazz = module.default || module;
                    const c = new Clazz();
                    const isController = Reflect.hasMetadata('ccc:rootPath', Clazz);
                    const hasRoutes = Reflect.hasMetadata('ccc:routes', c);
                    if (isController && hasRoutes) {
                        const basePath = Reflect.getMetadata('ccc:rootPath', Clazz);
                        const routes = Reflect.getMetadata('ccc:routes', c);
                        routes.forEach((route) => {
                            const currentPath = basePath + route.url;
                            const handler = c[route.handler];
                            const fileds = Reflect.getMetadata('ccc:fileds', c, route.handler);
                            const validates = Reflect.getMetadata('ccc:validates', c, route.handler);
                            const returnType = Reflect.getMetadata('design:returntype', c, route.handler);
                            const contentType = Reflect.getMetadata('ccc:content-type', c, route.handler);
                            const statusCode = Reflect.getMetadata('ccc:status-code', c, route.handler);
                            const interceptors = this.app.getInterceptors();
                            let middlewares = [];
                            this.app.koaBody ? middlewares.push(this.app.koaBody) : false;
                            middlewares = middlewares.concat(interceptors);
                            router[route.method](currentPath, ...middlewares, async (ctx, next) => {
                                try {
                                    if (!this.checkAuthPermit(ctx, c, route.handler)) {
                                        this.app.handlerError(new ForbiddenError_1.ForbiddenError(ctx), ctx);
                                        return;
                                    }
                                    const args = this.buildHandleArguments(ctx, c, fileds);
                                    // 校验
                                    await this.validateFields(args, validates);
                                    const data = await handler.apply(c, args);
                                    if (statusCode) {
                                        ctx.status = statusCode;
                                    }
                                    if (returnType && data !== undefined) {
                                        ctx.body = data;
                                    }
                                    if (contentType) {
                                        ctx.type = contentType;
                                    }
                                }
                                catch (e) {
                                    this.app.handlerError(e, ctx);
                                }
                                finally {
                                    await next();
                                }
                            });
                        });
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.Router = Router;
