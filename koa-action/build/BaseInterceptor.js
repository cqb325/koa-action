(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path-to-regexp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseInterceptor = void 0;
    const path_to_regexp_1 = require("path-to-regexp");
    class BaseInterceptor {
        constructor() {
            this.matchers = [];
        }
        antMatchers(...patterns) {
            patterns.forEach((pattern) => {
                this.matchers.push((0, path_to_regexp_1.match)('/(.*)' + pattern, {
                    decode: decodeURIComponent,
                }));
            });
            return this;
        }
        /**
         * 初始化
         * @returns
         */
        antInit() {
            this.matchers = [];
            return this;
        }
        /**
         * 设置X-Frame-Options
         * @param ctx
         */
        sameOrign(ctx) {
            ctx.set('X-Frame-Options', 'SAMEORIGIN');
            return this;
        }
        /**
         * 无需校验
         * @param url
         * @returns
         */
        permitAll(url) {
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
        preHandle(ctx) {
            return true;
        }
        afterHandle(ctx) {
        }
    }
    exports.BaseInterceptor = BaseInterceptor;
});
