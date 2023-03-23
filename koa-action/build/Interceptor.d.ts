export interface Interceptor {
    preHandle(ctx: any): boolean | Promise<boolean>;
    afterHandle(ctx: any): void;
}
