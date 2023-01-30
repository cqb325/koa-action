import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Route } from "./types/index";
import path from "node:path";
import fs from "node:fs";
import { ForbiddenError } from "./errors/ForbiddenError";
import { RequestParamInvalidError } from './errors/RequestParamInvalidError';
const KoaRouter = require('@koa/router');

export class Router extends KoaRouter {
    app: any;

    constructor (app: any, ops?: any) {
        super(ops);
        this.app = app;
    }

    scan (scanDir:string[]): void {
        let dirs;
        if (scanDir) {
            dirs = scanDir;
        } else {
            dirs = this.app.config.controllers;
        }
        
        if (typeof dirs === 'string') {
            this.doScanControllers(dirs, this);
        } else {
            dirs.forEach((cur: string) => {
                this.doScanControllers(cur, this);
            });
        }
    }

    private checkAuthPermit (ctx: any, target:any, handler:string):boolean {
        const authorizePermit:boolean = Reflect.getMetadata('ccc:authorizePermit', target, handler);
        if (authorizePermit) {
            return true;
        }
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

    doScanControllers (dir: string, router: Router): void {
        let routerDir:string = path.join(process.cwd(), dir);
        try {
            if(fs.existsSync(routerDir)){
                const files:string[] = fs.readdirSync(routerDir);
                files.forEach((file:string)=>{
                    let fileName:string = path.basename(file, path.extname(file));
                    const module = require(path.resolve(routerDir, fileName));
                    const Clazz = module.default || module;
                    const c = new Clazz();
                    const isController:boolean = Reflect.hasMetadata('ccc:rootPath', Clazz);
                    const hasRoutes:boolean = Reflect.hasMetadata('ccc:routes', c);
                    if (isController && hasRoutes) {
                        const basePath: string = Reflect.getMetadata('ccc:rootPath', Clazz);
                        const routes: Route[] = Reflect.getMetadata('ccc:routes', c);
                        routes.forEach((route: Route) => {
                            const currentPath:string = basePath + route.url;
                            const handler = c[route.handler];
                            const fileds = Reflect.getMetadata('ccc:fileds', c, route.handler);
                            const validates: boolean[] = Reflect.getMetadata('ccc:validates', c, route.handler);
                            const returnType:any = Reflect.getMetadata('design:returntype', c, route.handler);
                            const contentType:string = Reflect.getMetadata('ccc:content-type', c, route.handler);
                            const statusCode:number = Reflect.getMetadata('ccc:status-code', c, route.handler);
                            const interceptors = this.app.getInterceptors();
                            let middlewares = [];
                            this.app.koaBody ? middlewares.push(this.app.koaBody) : false;
                            middlewares = middlewares.concat(interceptors);
                            router[route.method](currentPath, ...middlewares, async (ctx: any, next: any) => {
                                try {
                                    if (!this.checkAuthPermit(ctx, c, route.handler)) {
                                        this.app.handlerError(new ForbiddenError(ctx), ctx);
                                        return;
                                    }
                                    const args: any[] = this.buildHandleArguments(ctx, c, fileds);
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
                                } catch (e: any) {
                                    this.app.handlerError(e, ctx);
                                } finally {
                                    await next();
                                }
                            });
                        });
                    }
                });
            }
        } catch (e: any) {
            console.log(e);
        }
    }
}
