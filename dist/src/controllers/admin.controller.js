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
const koa_action_1 = require("../../koa-action");
const AdminService_1 = require("../services/AdminService");
const User_1 = require("../po/User");
let AdminController = class AdminController {
    async list(a, headers) {
        // console.log(headers);
        // this.send(this.as.list().join(','));
        console.log('controller list');
        const list = await this.adminService.listPhotos();
        console.log(list);
        return koa_action_1.DefaultDataResponse.ok(this.adminService.list().join(','));
    }
    async add(a) {
        // console.log(headers);
        // this.send(this.as.list().join(','));
        console.log('controller add', a);
        return koa_action_1.DefaultDataResponse.ok(a);
    }
    async login(user, ctx) {
        const token = this.adminService.login(user);
        console.log('AuthToekn', 'Bearer ' + token);
        // ctx.session.capcha = '12345';
        return koa_action_1.DefaultDataResponse.ok(user);
    }
    async void(a, ctx) {
        console.log('controller void');
        return this.adminService.list().join(',');
    }
};
__decorate([
    koa_action_1.Service,
    __metadata("design:type", AdminService_1.AdminService)
], AdminController.prototype, "adminService", void 0);
__decorate([
    (0, koa_action_1.ContentType)('text/plain'),
    (0, koa_action_1.Get)('/list'),
    __param(0, (0, koa_action_1.Param)('name')),
    __param(1, koa_action_1.Headers),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "list", null);
__decorate([
    (0, koa_action_1.Post)('/add'),
    __param(0, koa_action_1.Validate),
    __param(0, koa_action_1.Body),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "add", null);
__decorate([
    (0, koa_action_1.Post)('/login'),
    __param(0, koa_action_1.Body),
    __param(1, koa_action_1.Context),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, koa_action_1.Get)('/void'),
    __param(0, (0, koa_action_1.Param)('name')),
    __param(1, koa_action_1.Context),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "void", null);
AdminController = __decorate([
    (0, koa_action_1.Controller)('/admin')
], AdminController);
exports.default = AdminController;
