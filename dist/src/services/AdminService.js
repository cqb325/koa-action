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
exports.AdminService = void 0;
const koa_action_1 = require("../../koa-action");
const Repository_1 = require("typeorm/repository/Repository");
const Photo_entity_1 = require("../entries/Photo.entity");
const jwt = require('jsonwebtoken');
class AdminService {
    list() {
        return ['a', 'b', 'c'];
    }
    async listPhotos() {
        const photos = await this.photoReposity.find();
        return photos;
    }
    login(user) {
        console.log(user);
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shared-secret', { expiresIn: '30m' });
        return token;
    }
}
__decorate([
    (0, koa_action_1.AutoRepository)(Photo_entity_1.Photo),
    __metadata("design:type", Repository_1.Repository)
], AdminService.prototype, "photoReposity", void 0);
exports.AdminService = AdminService;
