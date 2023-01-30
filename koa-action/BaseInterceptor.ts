import { Interceptor } from './Interceptor';
import { match } from 'path-to-regexp';

export abstract class BaseInterceptor implements Interceptor {
    matchers: any[] = [];

    antMatchers (...patterns: string[]): BaseInterceptor {
        patterns.forEach((pattern: string) => {
            this.matchers.push(match(pattern, {
                decode: decodeURIComponent,
            }));
        });
        return this;
    }

    antInit (): BaseInterceptor {
        this.matchers = [];
        return this;
    }

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