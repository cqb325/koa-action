import { BaseInterceptor, Authorization, AuthorizationError } from '../../koa-action';
const { verify, TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
import url from 'node:url';

export class AuthInterceptor extends BaseInterceptor {
    private secret: string;

    constructor (options: any) {
        super();
        this.secret = options.secret;
    }

    async checkAuth (ctx:any): Promise<boolean> {
        ctx.auth = new Authorization();

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

    async verifyToken (ctx: any, token: string): Promise<boolean> {
        return await new Promise ((resolve) => {
            verify(token, this.secret, (err: any, decoded: string) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        throw new AuthorizationError(ctx, 'Authorization is expired');
                    } else if (err instanceof JsonWebTokenError) {
                        throw new AuthorizationError(ctx, 'Authorization token is invalid');
                    } else {
                        throw new AuthorizationError(ctx, 'Authorization is invalid');
                    }
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }


    async preHandle (ctx: any): Promise<boolean> {
        console.log('before controller...');

        const parsedUrl = url.parse(ctx.url);
        const needAuth = this.antInit().antMatchers('/admin/login', '/admin/list').permitAll(parsedUrl.pathname);
        console.log(needAuth);
        
        if (needAuth) {
            return await this.checkAuth(ctx);
        } else {
            ctx.auth = new Authorization();
            ctx.auth.setAuthorized(true);
        }
        return true;
    }
    afterHandle (ctx: any): void {
        console.log('after controller...');
    }
}