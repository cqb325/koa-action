"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInterceptor = void 0;
const Keys_1 = require("./../constaints/Keys");
const koa_action_1 = require("../../koa-action");
const koa_action_2 = require("../../koa-action");
const JwtUtil_1 = require("../utils/JwtUtil");
const node_url_1 = __importDefault(require("node:url"));
class AuthInterceptor extends koa_action_1.BaseInterceptor {
    async checkAuth(ctx) {
        ctx.auth = new koa_action_1.Authorization();
        if (!ctx.header || !ctx.header.cmhiauth) {
            ctx.auth.setAuthorized(false);
            return true;
        }
        const token = ctx.header.cmhiauth.trim();
        const publicKey = await this.redisTemplate.get(Keys_1.KEY_LOGIN_RSA_PREFIX + "PUBLIC") || '';
        const ret = await JwtUtil_1.JwtUtil.checkToken(publicKey, token, ctx);
        if (ret) {
            ctx.auth.setData(ret);
        }
        ctx.auth.setAuthorized(!!ret);
        return true;
    }
    async preHandle(ctx) {
        const parsedUrl = node_url_1.default.parse(ctx.url);
        const needAuth = this.antInit().sameOrign(ctx)
            .antMatchers('/manager/user/captchaGet', '/manager/user/getLoginPublicKey', '/manager/user/login')
            .antMatchers('/file/(.*)').permitAll(parsedUrl.pathname);
        console.log(needAuth);
        if (needAuth) {
            return await this.checkAuth(ctx);
        }
        else {
            ctx.auth = new koa_action_1.Authorization();
            ctx.auth.setAuthorized(true);
        }
        return true;
    }
    afterHandle(ctx) {
    }
}
__decorate([
    koa_action_2.Autowired,
    __metadata("design:type", koa_action_2.RedisTemplate)
], AuthInterceptor.prototype, "redisTemplate", void 0);
exports.AuthInterceptor = AuthInterceptor;
