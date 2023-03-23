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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginModel_1 = require("./../po/LoginModel");
const koa_action_1 = require("../../koa-action");
const AdminService_1 = require("../services/AdminService");
const captcha_1 = require("../utils/captcha");
const SysLog_1 = require("../aspects/SysLog");
let UserController = class UserController {
    async list(session) {
        this.log.info('req: /captchaGet');
        const captcha = new captcha_1.Captcha({ width: 100 });
        const ret = await captcha.generate();
        session.captcha = ret.answer;
        return ret.imageBuffer;
    }
    async getLoginPublicKey() {
        const ret = await this.adminService.getLoginPublicKey();
        return koa_action_1.DefaultDataResponse.ok(ret);
    }
    /**
     * 登录
     * @param loginModel
     * @param req
     * @param session
     * @param ctx
     * @returns
     */
    async login(loginModel, req, session, ctx) {
        const ip = req.url;
        const username = loginModel.u;
        const password = loginModel.p;
        let message = '';
        if (!loginModel.captcha) {
            message = '请输入验证码';
        }
        else if (!session.captcha) {
            message = '验证码已失效';
        }
        else if (loginModel.captcha.toLowerCase() !== session.captcha.toLowerCase()) {
            message = '验证码错误';
        }
        console.log(username, password, message);
        if (message) {
            return koa_action_1.DefaultDataResponse.failWithCodeMessage(501, message);
        }
        const ret = await this.adminService.loginAndGenerateToken(username, password, ip);
        console.log(ret);
        if (!ret.token) {
            // sysLoginLogService.loginLog(username, 0, ip, new Date(),null, SysLoginLogEnum.getStrByCode(00));
            console.error("[用户管理平台]----- {} 获取 tokenGenerate 失败 ", username);
            if (!ret.message) {
                ret.message = "获取 tokenGenerate 失败";
            }
            ctx.set('l-code', 500);
            return koa_action_1.DefaultDataResponse.fail(ret.message);
        }
        // sysLoginLogService.loginLog(username, 1, ip, new Date(), null , SysLoginLogEnum.getStrByCode(00));
        console.info("[用户管理平台]----- {} 获取 tokenGenerate 成功 ", username);
        ctx.set("l-code", "200");
        ctx.set("x-token", ret.token);
        return koa_action_1.DefaultDataResponse.ok('');
    }
    async getUserInfo(auth) {
        const user = auth.getData();
        // if (!StringUtils.isEmpty(adminInfoRespModel)) {
        //     return ResponseDataMessage.ok("获取当前用户信息成功", adminInfoRespModel);
        // } else {
        //     return ResponseDataMessage.fail("获取当前用户信息失败");
        // }
        return koa_action_1.DefaultDataResponse.ok(user);
    }
};
__decorate([
    (0, koa_action_1.Log)(),
    __metadata("design:type", Object)
], UserController.prototype, "log", void 0);
__decorate([
    koa_action_1.Service,
    __metadata("design:type", AdminService_1.AdminService)
], UserController.prototype, "adminService", void 0);
__decorate([
    (0, koa_action_1.ContentType)('jpg'),
    (0, koa_action_1.Get)('/captchaGet'),
    (0, SysLog_1.SysLog)("验证码"),
    __param(0, koa_action_1.Session),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    (0, koa_action_1.Get)('/getLoginPublicKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLoginPublicKey", null);
__decorate([
    (0, koa_action_1.Post)('/login'),
    __param(0, koa_action_1.Body),
    __param(1, koa_action_1.Request),
    __param(2, koa_action_1.Session),
    __param(3, koa_action_1.Context),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginModel_1.LoginModel, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, koa_action_1.Post)('/getUserInfo'),
    __param(0, koa_action_1.Auth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [koa_action_1.Authorization]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
UserController = __decorate([
    (0, koa_action_1.Controller)('/manager/user')
], UserController);
exports.default = UserController;
