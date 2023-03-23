import { Interceptor } from './Interceptor';
export declare class BaseInterceptor implements Interceptor {
    matchers: any[];
    constructor();
    antMatchers(...patterns: string[]): BaseInterceptor;
    /**
     * 初始化
     * @returns
     */
    antInit(): BaseInterceptor;
    /**
     * 设置X-Frame-Options
     * @param ctx
     */
    sameOrign(ctx: any): BaseInterceptor;
    /**
     * 无需校验
     * @param url
     * @returns
     */
    permitAll(url: string | null): boolean;
    preHandle(ctx: any): boolean | Promise<boolean>;
    afterHandle(ctx: any): void;
}
