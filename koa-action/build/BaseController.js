(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseController = void 0;
    const path = require('path');
    const fs = require('fs');
    /**
     * Context Class
     * @type {[type]}
     */
    class BaseController {
        setCtx(ctx) {
            this.ctx = ctx;
            this.init();
        }
        /**
         * send response
         * @param  {[type]} body [description]
         * @return {[type]}      [description]
         */
        send(body) {
            this.ctx.body = body;
        }
        /**
         * json返回数据
         * @param  {any} data data body
         * @param  {String} msg  response msg
         * @param  {Number} code response code
         * @return {void}
         */
        json(data, msg, code) {
            let body = {};
            switch (arguments.length) {
                case 1:
                    body = data;
                    break;
                case 2:
                    body = {
                        data: data,
                        msg: msg,
                    };
                    break;
                case 3:
                    body = {
                        data: data,
                        msg: msg,
                        code: code
                    };
                    break;
            }
            this.ctx.body = body;
        }
        /**
         * 跳转页面
         * @param  {[type]} view [description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        async forward(view, data) {
            await this.ctx.render(view, data);
        }
        /**
         * 重定向
         * @param  {[type]} url redirect url
         * @return {[type]}      [description]
         */
        redirect(url) {
            this.ctx.redirect(url);
        }
        /**
         * router之间跳转
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        // async chain(url:string): Promise<void> {
        //     if(this.routerMap && this.routerMap[url]){
        //         let handler = this.routerMap[url];
        //         await handler.apply(this, []);
        //     }
        // }
        /**
         * 下载
         * @param  {[type]} file [description]
         * @return {[type]}      [description]
         */
        download(file) {
            const filename = path.relative(path.dirname(file), file);
            this.ctx.set('Content-disposition', 'attachment; filename=' + filename);
            this.ctx.body = fs.createReadStream(file);
        }
        /**
         * isGet
         * @return {Boolean} [description]
         */
        isGet() {
            if (this.ctx.method === 'GET') {
                return true;
            }
            return false;
        }
        /**
         * isPost
         * @return {Boolean} [description]
         */
        isPost() {
            if (this.ctx.method === 'POST') {
                return true;
            }
            return false;
        }
        /**
         * 是否是某个操作
         * @param  {[type]}  method [description]
         * @return {Boolean}        [description]
         */
        isMethod(method) {
            method = method.toUpperCase();
            return this.ctx.method === method;
        }
        /**
         * ajax请求
         * @return {Boolean} [description]
         */
        isAjax() {
            return this.ctx.get('X-Requested-With') === 'XMLHttpRequest';
        }
        /**
         * 初始化
         * @return {[type]} [description]
         */
        init() {
            this.initParams();
        }
        /**
         * 初始化参数
         * @return {[type]} [description]
         */
        initParams() {
            let params = {};
            if (this.isGet() || this.isMethod('DELETE') || this.isMethod('HEAD')) {
                params = this.ctx.request.query;
            }
            else {
                params = this.ctx.request.body;
            }
            this.params = Object.assign({}, params, this.ctx.params || {});
        }
    }
    exports.BaseController = BaseController;
});
