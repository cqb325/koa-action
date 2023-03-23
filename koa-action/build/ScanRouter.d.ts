declare const KoaRouter: any;
export declare class Router extends KoaRouter {
    app: any;
    constructor(app: any, ops?: any);
    scan(scanDir: string[]): void;
    /**
     * 校验权限
     * @param ctx
     * @param target
     * @param handler
     * @returns
     */
    private checkAuthPermit;
    /**
     * 构建参数
     * @param ctx
     * @param target
     * @param fileds
     */
    buildHandleArguments(ctx: any, target: any, fileds: any[]): any[];
    /**
     * 校验字段
     * @param vals
     * @param validates
     */
    validateFields(vals: any[], validates: boolean[]): Promise<void>;
    /**
     * 处理Controller
     * @param Clazz
     */
    handleController(Clazz: any): void;
}
export {};
