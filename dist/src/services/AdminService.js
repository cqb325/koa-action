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
const SysAdminUser_entity_1 = require("./../entries/SysAdminUser.entity");
const koa_action_1 = require("../../koa-action");
const Repository_1 = require("typeorm/repository/Repository");
const Keys_1 = require("../constaints/Keys");
const RsaSecurityUtil_1 = require("../utils/RsaSecurityUtil");
const NodeRSA = require('node-rsa');
const md5 = require('md5');
const crypt = require('crypt');
const jwt = require('jsonwebtoken');
class AdminService {
    list() {
        return ['a', 'b', 'c'];
    }
    async listPhotos() {
        const photos = [];
        return photos;
    }
    login(user) {
        console.log(user);
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shared-secret', { expiresIn: '30m' });
        return token;
    }
    /**
     * 验证登录并创建token
     * @param username
     * @param password
     * @param ip
     */
    async loginAndGenerateToken(username, password, ip) {
        const user = await this.sysAdminUserRepo.findOneBy({
            username
        });
        const ret = {};
        if (!user || !password) {
            ret.message = "用户名或密码错误";
            return ret;
        }
        const privateKey = await this.redisTemplate.get(Keys_1.KEY_LOGIN_RSA_PREFIX + "PRIVATE") || '';
        if (!privateKey) {
            ret.message = "加密公钥过期, 请重新请求";
            return ret;
        }
        password = (0, RsaSecurityUtil_1.decrypt)(privateKey, password);
        let hashed = md5(user.salt + password, { asBytes: true });
        const loginPassword = crypt.bytesToBase64(md5(hashed, { asBytes: true }));
        const error = this.checkLoginError(user, 5, ip);
        if (loginPassword !== user.passwordFirst) {
            await this.updateErrorLogin(user, ip);
            ret.message = "用户名或密码错误";
            return ret;
        }
        if (error) {
            ret.message = error;
        }
        //删除该用户在其他设备登录的token，剔除前一个用户的登录
        const prefix = "USER_" + username + "_*"; //这个*一定要加，否则无法模糊查询
        const keys = await this.redisTemplate.keys(prefix);
        if (keys && keys.length) {
            for (let key in keys) {
                this.redisTemplate.del(key);
            }
        }
        const storedUser = Object.assign({}, user, { salt: null, passwordFirst: null, passwordSecond: null, passwordThird: null,
            passwordFourth: null, passwordFifth: null, errorLoginTimes: null, errorIp: null, errorIpTimes: null, errorTime: null });
        const token = jwt.sign(JSON.parse(JSON.stringify(storedUser)), privateKey, { algorithm: 'RS512', expiresIn: '30m' });
        ret.token = token;
        await this.redisTemplate.set(Keys_1.KEY_USER_PREFIX + user.username + "_" + token, JSON.stringify(user));
        await this.redisTemplate.expire(Keys_1.KEY_USER_PREFIX + user.username + "_" + token, 30 * 60);
        this.updateLogin(user, ip);
        return ret;
    }
    /**
     * 更新登录日志
     * @param user
     * @param ip
     */
    async updateLogin(user, ip) {
        user.errorIp = ip;
        user.errorIpTimes = 0;
        user.errorLoginTimes = 0;
        user.errorTime = new Date();
        await this.sysAdminUserRepo.save(user);
    }
    /**
     * 更新错误登录记录
     * @param user
     * @param ip
     */
    async updateErrorLogin(user, ip) {
        if (user.errorIp == null || user.errorIp !== ip || Date.now() - user.errorTime.getTime() > 60 * 60000) {
            user.errorIp = ip;
            user.errorIpTimes = 1;
        }
        else {
            user.errorIpTimes = user.errorIpTimes + 1;
        }
        user.errorTime = new Date();
        if (user.errorLoginTimes && Date.now() - user.errorTime.getTime() < 60 * 60000) {
            user.errorLoginTimes++;
        }
        else {
            user.errorIpTimes = 1;
        }
        await this.sysAdminUserRepo.save(user);
    }
    /**
     * 是否超过错误次数被禁用了
     * @param user
     * @param times
     * @param ip
     * @returns
     */
    checkLoginError(user, times, ip) {
        if (user.errorTime && Date.now() - user.errorTime.getTime() < 60 * 60000) {
            if (user.errorLoginTimes >= times) {
                return "您已连续登录失败5次，请1小时后再次登录！";
            }
        }
        return null;
    }
    /**
     * 获取登录使用加密的publicKey
     * @returns
     */
    async getLoginPublicKey() {
        let publicKey = await this.redisTemplate.get(Keys_1.KEY_LOGIN_RSA_PREFIX + 'PUBLIC');
        if (!publicKey) {
            const key = NodeRSA({ b: 2048 });
            const privateKey = key.exportKey('private');
            publicKey = key.exportKey('public');
            this.redisTemplate.set(Keys_1.KEY_LOGIN_RSA_PREFIX + "PUBLIC", publicKey || '');
            this.redisTemplate.set(Keys_1.KEY_LOGIN_RSA_PREFIX + "PRIVATE", privateKey);
        }
        return publicKey || '';
    }
    async getUserInfo() {
        return null;
    }
}
__decorate([
    (0, koa_action_1.AutoRepository)(SysAdminUser_entity_1.SysAdminUser),
    __metadata("design:type", Repository_1.Repository)
], AdminService.prototype, "sysAdminUserRepo", void 0);
__decorate([
    koa_action_1.Autowired,
    __metadata("design:type", koa_action_1.RedisTemplate)
], AdminService.prototype, "redisTemplate", void 0);
exports.AdminService = AdminService;
