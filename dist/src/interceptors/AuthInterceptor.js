"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInterceptor = void 0;
const koa_action_1 = require("../../koa-action");
const { verify, TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const node_url_1 = __importDefault(require("node:url"));
class AuthInterceptor extends koa_action_1.BaseInterceptor {
    constructor(options) {
        super();
        this.secret = options.secret;
    }
    async checkAuth(ctx) {
        ctx.auth = new koa_action_1.Authorization();
        if (!ctx.header || !ctx.header.authorization) {
            ctx.auth.setAuthorized(false);
            return true;
        }
        const parts = ctx.header.authorization.trim().split(' ');
        let token = '';
        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        }
        const ret = await this.verifyToken(ctx, token);
        ctx.auth.setAuthorized(ret);
        return true;
    }
    async verifyToken(ctx, token) {
        return await new Promise((resolve) => {
            verify(token, this.secret, (err, decoded) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        throw new koa_action_1.AuthorizationError(ctx, 'Authorization is expired');
                    }
                    else if (err instanceof JsonWebTokenError) {
                        throw new koa_action_1.AuthorizationError(ctx, 'Authorization token is invalid');
                    }
                    else {
                        throw new koa_action_1.AuthorizationError(ctx, 'Authorization is invalid');
                    }
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    async preHandle(ctx) {
        console.log('before controller...');
        const parsedUrl = node_url_1.default.parse(ctx.url);
        const needAuth = this.antInit().antMatchers('/admin/login', '/admin/list').permitAll(parsedUrl.pathname);
        console.log(needAuth);
        if (needAuth) {
            return await this.checkAuth(ctx);
        }
        else {
            ctx.auth = new koa_action_1.Authorization();
            ctx.auth.setAuthorized(true);
        }
        return true;
    }
    afterHandle(ctx) {
        console.log('after controller...');
    }
}
exports.AuthInterceptor = AuthInterceptor;
