(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Global", "class-transformer", "class-validator", "./errors/ForbiddenError", "./errors/RequestParamInvalidError", "./ModuleScanner"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Router = void 0;
    const Global_1 = require("./Global");
    const class_transformer_1 = require("class-transformer");
    const class_validator_1 = require("class-validator");
    const ForbiddenError_1 = require("./errors/ForbiddenError");
    const RequestParamInvalidError_1 = require("./errors/RequestParamInvalidError");
    const ModuleScanner_1 = require("./ModuleScanner");
    const KoaRouter = require('@koa/router');
    class Router extends KoaRouter {
        constructor(app, ops) {
            super(ops);
            this.app = app;
        }
        scan(scanDir) {
            const scanner = new ModuleScanner_1.ModuleScanner(process.cwd(), scanDir, (Module) => {
                this.handleController(Module);
            });
            scanner.scan();
        }
        /**
         * 校验权限
         * @param ctx
         * @param target
         * @param handler
         * @returns
         */
        checkAuthPermit(ctx, target, handler) {
            var _a, _b;
            const authorizePermit = Reflect.getMetadata('ccc:authorizePermit', target, handler);
            if (authorizePermit) {
                this.app.logger.debug(`controller ${target} ${handler} authorizePermit ${authorizePermit}`);
                return true;
            }
            this.app.logger.debug(`controller ${target} ${handler} auth ${(_a = ctx.auth) === null || _a === void 0 ? void 0 : _a.isAuthorized()}`);
            return (_b = ctx.auth) === null || _b === void 0 ? void 0 : _b.isAuthorized();
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
                        args[field.index] = ctx.request.query[field.name] || ctx.params[field.name];
                    }
                    if (field.type === 'file') {
                        args[field.index] = ctx.request.files[field.name];
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
        /**
         * 处理Controller
         * @param Clazz
         */
        handleController(Clazz) {
            try {
                const c = new Clazz();
                const isController = Reflect.hasMetadata('ccc:rootPath', Clazz);
                const hasRoutes = Reflect.hasMetadata('ccc:routes', c);
                if (isController && hasRoutes) {
                    const basePath = Reflect.getMetadata('ccc:rootPath', Clazz);
                    const routes = Reflect.getMetadata('ccc:routes', c);
                    routes.forEach((route) => {
                        const currentPath = basePath + route.url;
                        this.app.logger.debug(`register controller url ${currentPath}`);
                        const handler = c[route.handler];
                        const proxyHandler = new Proxy(handler, {
                            apply(method, ctx, argArray) {
                                // method 是否存在aspect
                                const pointCuts = Reflect.getMetadata('ccc:pointcuts', ctx, method.name);
                                if (pointCuts) {
                                    // 暂时只允许一个aspect
                                    const pointCut = pointCuts[0];
                                    const aspect = Global_1.Global.aspects.get(pointCut.key);
                                    return aspect === null || aspect === void 0 ? void 0 : aspect.advice(ctx, method, argArray, aspect, pointCut.data);
                                }
                                return Reflect.apply(method, ctx, argArray);
                            }
                        });
                        const fileds = Reflect.getMetadata('ccc:fileds', c, route.handler);
                        const validates = Reflect.getMetadata('ccc:validates', c, route.handler);
                        const returnType = Reflect.getMetadata('design:returntype', c, route.handler);
                        this.app.logger.debug(`${currentPath} returnType: ${returnType}`);
                        const contentType = Reflect.getMetadata('ccc:content-type', c, route.handler);
                        this.app.logger.debug(`${currentPath} contentType: ${contentType}`);
                        const statusCode = Reflect.getMetadata('ccc:status-code', c, route.handler);
                        this.app.logger.debug(`${currentPath} statusCode: ${statusCode}`);
                        const interceptors = this.app.getInterceptors();
                        let middlewares = [];
                        this.app.koaBody ? middlewares.push(this.app.koaBody) : false;
                        middlewares = middlewares.concat(interceptors);
                        this[route.method](currentPath, ...middlewares, async (ctx, next) => {
                            try {
                                if (!this.checkAuthPermit(ctx, c, route.handler)) {
                                    this.app.handlerError(new ForbiddenError_1.ForbiddenError(ctx), ctx);
                                    return;
                                }
                                const args = this.buildHandleArguments(ctx, c, fileds);
                                // 校验
                                await this.validateFields(args, validates);
                                const data = await proxyHandler.apply(c, args);
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
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    exports.Router = Router;
});
