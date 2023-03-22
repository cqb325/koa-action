import { Aspect, Global, PointCut } from './Global';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Route } from "./types/index";
import path from "node:path";
import fs from "node:fs";
import { ForbiddenError } from "./errors/ForbiddenError";
import { RequestParamInvalidError } from './errors/RequestParamInvalidError';
import { ModuleScanner } from './ModuleScanner';
const KoaRouter = require('@koa/router');

export class Router extends KoaRouter {
    app: any;

    constructor (app: any, ops?: any) {
        super(ops);
        this.app = app;
    }

    scan (scanDir:string[]): void {
        const scanner = new ModuleScanner(process.cwd(), scanDir, (Module: any) => {
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
    private checkAuthPermit (ctx: any, target:any, handler:string):boolean {
        const authorizePermit:boolean = Reflect.getMetadata('ccc:authorizePermit', target, handler);
        if (authorizePermit) {
            this.app.logger.debug(`controller ${target} ${handler} authorizePermit ${authorizePermit}`);
            return true;
        }
        this.app.logger.debug(`controller ${target} ${handler} auth ${ctx.auth?.isAuthorized()}`);
        return ctx.auth?.isAuthorized();
    }

    /**
     * 构建参数
     * @param ctx 
     * @param target 
     * @param fileds 
     */
    buildHandleArguments (ctx: any, target:any, fileds: any[]): any[] {
        const args: any[] = [];
        if (fileds && fileds.length) {
            fileds.forEach((field:any) => {
                if (field.type === 'param') {
                    args[field.index] = ctx.request.query[field.name] || ctx.params[field.name];
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
                    args[field.index] = plainToClass(field.Class, ctx.request.body);
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
            })
        }
        return args;
    }

    /**
     * 校验字段
     * @param vals 
     * @param validates 
     */
    async validateFields (vals: any[], validates: boolean[]) {
        if (validates && validates.length) {
            for (let i = 0; i < validates.length; i++) {
                // 需要进行校验
                if (validates[i]) {
                    const errs = await validate(vals[i]);
                    if (errs.length) {
                        const ret = errs.map(err => {
                            return err.constraints;
                        });
                        throw new RequestParamInvalidError(JSON.stringify(ret));
                    }
                }
            }
        }
    }

    /**
     * 处理Controller
     * @param Clazz 
     */
    handleController (Clazz: any): void {
        try {
            const c = new Clazz();
            const isController:boolean = Reflect.hasMetadata('ccc:rootPath', Clazz);
            const hasRoutes:boolean = Reflect.hasMetadata('ccc:routes', c);
            if (isController && hasRoutes) {
                const basePath: string = Reflect.getMetadata('ccc:rootPath', Clazz);
                const routes: Route[] = Reflect.getMetadata('ccc:routes', c);
                routes.forEach((route: Route) => {
                    const currentPath:string = basePath + route.url;
                    this.app.logger.debug(`register controller url ${currentPath}`);
                    const handler = c[route.handler];
                    const proxyHandler = new Proxy(handler, {
                        apply (method, ctx, argArray) {
                            // method 是否存在aspect
                            const pointCuts: PointCut[] = Reflect.getMetadata('ccc:pointcuts', ctx, method.name);
                            if (pointCuts) {
                                // 暂时只允许一个aspect
                                const pointCut:PointCut = pointCuts[0];
                                const aspect: Aspect | undefined = Global.aspects.get(pointCut.key);
                                return aspect?.advice(ctx, method, argArray, aspect, pointCut.data);
                            }
                            
                            return Reflect.apply(method, ctx, argArray);
                        }
                    });
                    const fileds = Reflect.getMetadata('ccc:fileds', c, route.handler);
                    const validates: boolean[] = Reflect.getMetadata('ccc:validates', c, route.handler);
                    const returnType:any = Reflect.getMetadata('design:returntype', c, route.handler);
                    this.app.logger.debug(`${currentPath} returnType: ${returnType}`);
                    const contentType:string = Reflect.getMetadata('ccc:content-type', c, route.handler);
                    this.app.logger.debug(`${currentPath} contentType: ${contentType}`);
                    const statusCode:number = Reflect.getMetadata('ccc:status-code', c, route.handler);
                    this.app.logger.debug(`${currentPath} statusCode: ${statusCode}`);
                    const interceptors = this.app.getInterceptors();
                    let middlewares = [];
                    this.app.koaBody ? middlewares.push(this.app.koaBody) : false;
                    middlewares = middlewares.concat(interceptors);
                    this[route.method](currentPath, ...middlewares, async (ctx: any, next: any) => {
                        try {
                            if (!this.checkAuthPermit(ctx, c, route.handler)) {
                                this.app.handlerError(new ForbiddenError(ctx), ctx);
                                return;
                            }
                            const args: any[] = this.buildHandleArguments(ctx, c, fileds);
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
                        } catch (e: any) {
                            this.app.handlerError(e, ctx);
                        } finally {
                            await next();
                        }
                    });
                });
            }
        } catch (e: any) {
            console.log(e);
        }
    }
}
