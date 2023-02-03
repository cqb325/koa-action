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
Object.defineProperty(exports, "__esModule", { value: true });
const koa_action_1 = require("../../koa-action");
const AdminService_1 = require("../services/AdminService");
const captcha_1 = require("../utils/captcha");
let AdminController = class AdminController {
    async list() {
        const captcha = new captcha_1.Captcha({});
        const ret = await captcha.generate();
        return ret.imageBuffer;
    }
};
__decorate([
    koa_action_1.Service,
    __metadata("design:type", AdminService_1.AdminService)
], AdminController.prototype, "adminService", void 0);
__decorate([
    (0, koa_action_1.ContentType)('jpg'),
    (0, koa_action_1.Get)('/captchaGet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "list", null);
AdminController = __decorate([
    (0, koa_action_1.Controller)('/user')
], AdminController);
exports.default = AdminController;
