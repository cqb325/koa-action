import { KEY_LOGIN_RSA_PREFIX } from './../constaints/Keys';
import { BaseInterceptor, Authorization } from '../../koa-action';
import { Autowired, RedisTemplate } from '../../koa-action';
import { JwtUtil } from '../utils/JwtUtil';
import url from 'node:url';

export class AuthInterceptor extends BaseInterceptor {
    @Autowired
    private redisTemplate: RedisTemplate

    async checkAuth (ctx:any): Promise<boolean> {
        ctx.auth = new Authorization();

        if (!ctx.header || !ctx.header.cmhiauth) {
            ctx.auth.setAuthorized(false);
            return true;
        }
    
        const token = ctx.header.cmhiauth.trim();
        const publicKey: string = await this.redisTemplate.get(KEY_LOGIN_RSA_PREFIX + "PUBLIC") || '';

        const ret:any = await JwtUtil.checkToken(publicKey, token, ctx);
        
        if (ret) {
            ctx.auth.setData(ret);
        }
        ctx.auth.setAuthorized(!!ret);
        return true;
    }

    async preHandle (ctx: any): Promise<boolean> {
        const parsedUrl = url.parse(ctx.url);

        const needAuth = this.antInit().sameOrign(ctx)
            .antMatchers('/manager/user/captchaGet', '/manager/user/getLoginPublicKey', '/manager/user/login')
            .antMatchers('/admin/list')
            .antMatchers('/file/(.*)').permitAll(parsedUrl.pathname);
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
    }
}