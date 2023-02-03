import { Interceptor } from './Interceptor';
import { match } from 'path-to-regexp';

export class BaseInterceptor implements Interceptor {
    matchers: any[] = [];

    constructor () {}

    antMatchers (...patterns: string[]): BaseInterceptor {
        patterns.forEach((pattern: string) => {
            this.matchers.push(match('/(.*)' + pattern, {
                decode: decodeURIComponent,
            }));
        });
        return this;
    }

    /**
     * 初始化
     * @returns 
     */
    antInit (): BaseInterceptor {
        this.matchers = [];
        return this;
    }

    /**
     * 设置X-Frame-Options
     * @param ctx 
     */
    sameOrign (ctx: any): BaseInterceptor {
        ctx.set('X-Frame-Options', 'SAMEORIGIN');
        return this;
    }

    /**
     * 无需校验
     * @param url 
     * @returns 
     */
    permitAll (url: string | null): boolean {
        let needCheck = true;
        for (let matcher of this.matchers) {
            const matchRet = matcher(url);
            
            // 不需要验证
            if (matchRet) {
                needCheck = false;
            }
        }
        return needCheck;
    }

    preHandle (ctx: any): boolean | Promise<boolean> {
        return true;
    }
    afterHandle (ctx: any): void {
    }
}