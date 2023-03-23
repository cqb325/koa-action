/**
 * Context Class
 * @type {[type]}
 */
export declare class BaseController {
    ctx: any;
    routerMap: any;
    params: any;
    setCtx(ctx: any): void;
    /**
     * send response
     * @param  {[type]} body [description]
     * @return {[type]}      [description]
     */
    send(body: any): void;
    /**
     * json返回数据
     * @param  {any} data data body
     * @param  {String} msg  response msg
     * @param  {Number} code response code
     * @return {void}
     */
    json(data: any, msg: string, code: number): void;
    /**
     * 跳转页面
     * @param  {[type]} view [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    forward(view: string, data: any): Promise<void>;
    /**
     * 重定向
     * @param  {[type]} url redirect url
     * @return {[type]}      [description]
     */
    redirect(url: string): void;
    /**
     * router之间跳转
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    /**
     * 下载
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    download(file: string): void;
    /**
     * isGet
     * @return {Boolean} [description]
     */
    isGet(): boolean;
    /**
     * isPost
     * @return {Boolean} [description]
     */
    isPost(): boolean;
    /**
     * 是否是某个操作
     * @param  {[type]}  method [description]
     * @return {Boolean}        [description]
     */
    isMethod(method: string): boolean;
    /**
     * ajax请求
     * @return {Boolean} [description]
     */
    isAjax(): boolean;
    /**
     * 初始化
     * @return {[type]} [description]
     */
    init(): void;
    /**
     * 初始化参数
     * @return {[type]} [description]
     */
    initParams(): void;
}
