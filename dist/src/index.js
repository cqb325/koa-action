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
const AuthInterceptor_1 = require("./interceptors/AuthInterceptor");
const koa_action_1 = require("../koa-action");
let Service = class Service extends koa_action_1.KoaAction {
    constructor() {
        super();
        this.registerDataSource();
    }
};
Service = __decorate([
    (0, koa_action_1.ScanPath)('./src/controllers'),
    (0, koa_action_1.Config)('./src/config.ts'),
    __metadata("design:paramtypes", [])
], Service);
const s = new Service();
s.registerInterceptor(new AuthInterceptor_1.AuthInterceptor({ secret: 'shared-secret' })).run();
