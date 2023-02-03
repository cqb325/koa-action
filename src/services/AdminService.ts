import { SysAdminUser } from './../entries/SysAdminUser.entity';
import { Autowired, AutoRepository, RedisTemplate } from "../../koa-action";
import { Repository } from "typeorm/repository/Repository";
import { Photo } from "../entries/Photo.entity";
import { User } from "../po/User";
import { KEY_LOGIN_RSA_PREFIX, KEY_USER_PREFIX } from "../constaints/Keys";
import { decrypt } from '../utils/RsaSecurityUtil';

const NodeRSA = require('node-rsa');
const md5 = require('md5');
const crypt = require('crypt');
const jwt = require('jsonwebtoken');

export class AdminService {

    @AutoRepository(SysAdminUser)
    private sysAdminUserRepo: Repository<SysAdminUser>

    @Autowired
    private redisTemplate: RedisTemplate

    list (): string[] {
        return ['a', 'b', 'c'];
    }

    async listPhotos (): Promise<Photo[]> {
        const photos:Photo[] = [];
        return photos;
    }

    login (user: User) {
        console.log(user);
        
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shared-secret', {expiresIn: '30m'});
        return token;
    }

    /**
     * 验证登录并创建token
     * @param username 
     * @param password 
     * @param ip 
     */
    async loginAndGenerateToken (username: string, password: string, ip:string) {
        const user: SysAdminUser | null = await this.sysAdminUserRepo.findOneBy({
            username
        });
        type Ret = {
            message?: string,
            token?: string
        }
        const ret: Ret = {};
        if (!user || !password){
            ret.message = "用户名或密码错误";
            return ret;
        }
        const privateKey: string = await this.redisTemplate.get(KEY_LOGIN_RSA_PREFIX + "PRIVATE") || '';
        if (!privateKey){
            ret.message = "加密公钥过期, 请重新请求";
            return ret;
        }
        password = decrypt(privateKey, password);
        console.log('解码后的密码: ', password);
        let hashed = md5(user.salt + password, {asBytes: true});
        const loginPassword = crypt.bytesToBase64(md5(hashed, {asBytes: true}));
        
        console.log("md5 加密后的password ", loginPassword);

        const error: string|null = this.checkLoginError(user, 5, ip);

        if (loginPassword !== user.passwordFirst ) {
            await this.updateErrorLogin(user, ip);
            ret.message = "用户名或密码错误";
            return ret;
        }
        if (error){
            ret.message = error;
        }

        //删除该用户在其他设备登录的token，剔除前一个用户的登录
        const prefix = "USER_"+username+"_*";//这个*一定要加，否则无法模糊查询
        const keys = await this.redisTemplate.keys(prefix);
        if (keys && keys.length) {
            for (let key in keys) {
                this.redisTemplate.del(key);
            }
        }

        const storedUser = Object.assign({}, user, {salt: null, passwordFirst: null, passwordSecond: null, passwordThird: null,
            passwordFourth: null, passwordFifth: null, errorLoginTimes: null, errorIp: null, errorIpTimes: null, errorTime: null});
        const token = jwt.sign(JSON.parse(JSON.stringify(storedUser)), privateKey, {algorithm: 'RS512', expiresIn: '30m'});
        ret.token = token;

        await this.redisTemplate.set(KEY_USER_PREFIX + user.username + "_" + token, JSON.stringify(user));
        await this.redisTemplate.expire(KEY_USER_PREFIX + user.username + "_" + token, 30 * 60);

        this.updateLogin(user, ip);

        return ret;
    }

    /**
     * 更新登录日志
     * @param user 
     * @param ip 
     */
    private async updateLogin (user: SysAdminUser, ip: string) {
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
    private async updateErrorLogin (user: SysAdminUser, ip: string) {
        if (user.errorIp == null || user.errorIp !== ip || Date.now() - user.errorTime.getTime() > 60 * 60000) {
            user.errorIp = ip;
            user.errorIpTimes = 1;
        } else {
            user.errorIpTimes = user.errorIpTimes + 1;
        }
        user.errorTime = new Date();
        if (user.errorLoginTimes && Date.now() - user.errorTime.getTime() < 60 * 60000) {
            user.errorLoginTimes ++;
        } else {
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
    private checkLoginError (user: SysAdminUser, times: number, ip: string) {
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
    async getLoginPublicKey (): Promise<string> {
        let publicKey:string|null = await this.redisTemplate.get(KEY_LOGIN_RSA_PREFIX + 'PUBLIC');
        if (!publicKey) {
            const key = NodeRSA({b: 2048});
            const privateKey:string = key.exportKey('private');
            publicKey = key.exportKey('public');

            this.redisTemplate.set(KEY_LOGIN_RSA_PREFIX + "PUBLIC", publicKey || '');
            this.redisTemplate.set(KEY_LOGIN_RSA_PREFIX + "PRIVATE", privateKey);
        }
        return publicKey || '';
    }

    async getUserInfo (): Promise<any> {
        return null;
    }
}