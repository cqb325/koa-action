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
            this.matchers.push((0, path_to_regexp_1.match)(pattern, {
                decode: decodeURIComponent,
            }));
        });
        return this;
    }
    antInit() {
        this.matchers = [];
        return this;
    }
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
