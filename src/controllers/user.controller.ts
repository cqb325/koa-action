import { LoginModel } from './../po/LoginModel';
import { Controller, Get, Post, Param, Headers, Authorization, Auth, Log, Service, ContentType, Body, Status, Context, AuthPermit, Validate, DefaultDataResponse, DataResponse, Request, Session } from "../../koa-action";
import { AdminService } from "../services/AdminService";
import { Captcha } from "../utils/captcha";

@Controller('/manager/user')
export default class UserController {

    @Log()
    private log: any

    @Service
    private adminService: AdminService;
    
    @ContentType('jpg')
    @Get('/captchaGet')
    async list (@Session session: any):Promise<any> {
        this.log.info('req: /captchaGet');
        
        const captcha = new Captcha({width: 100});
        const ret = await captcha.generate();
        
        session.captcha = ret.answer;

        return ret.imageBuffer;
    }

    @Get('/getLoginPublicKey')
    async getLoginPublicKey (): Promise<DataResponse> {
        const ret = await this.adminService.getLoginPublicKey();
        return DefaultDataResponse.ok(ret);
    }

    /**
     * 登录
     * @param loginModel 
     * @param req 
     * @param session 
     * @param ctx 
     * @returns 
     */
    @Post('/login')
    async login (@Body loginModel: LoginModel, @Request req: any, @Session session: any, @Context ctx: any): Promise<DataResponse> {
        const ip:string = req.url;
        const username: string = loginModel.u;
        const password: string = loginModel.p;

        let message = '';
        if (!loginModel.captcha) {
            message = '请输入验证码';
        } else if (!session.captcha) {
            message = '验证码已失效';
        } else if (loginModel.captcha.toLowerCase() !== session.captcha.toLowerCase()) {
            message = '验证码错误';
        }
        console.log(username, password, message);
        
        if (message) {
            return DefaultDataResponse.failWithCodeMessage(501, message);
        }

        const ret = await this.adminService.loginAndGenerateToken(username, password, ip);
        console.log(ret);
        if (!ret.token) {
            // sysLoginLogService.loginLog(username, 0, ip, new Date(),null, SysLoginLogEnum.getStrByCode(00));
            console.error("[用户管理平台]----- {} 获取 tokenGenerate 失败 ", username);
            if (!ret.message) {
                ret.message = "获取 tokenGenerate 失败";
            }
            ctx.set('l-code', 500)
            return DefaultDataResponse.fail(ret.message);
        }
        // sysLoginLogService.loginLog(username, 1, ip, new Date(), null , SysLoginLogEnum.getStrByCode(00));
        console.info("[用户管理平台]----- {} 获取 tokenGenerate 成功 ", username);

        ctx.set("l-code", "200");
        ctx.set("x-token", ret.token);

        return DefaultDataResponse.ok('');
    }

    @Post('/getUserInfo')
    async getUserInfo (@Auth auth: Authorization): Promise<DataResponse> {
        const user = auth.getData();
        
        // if (!StringUtils.isEmpty(adminInfoRespModel)) {
        //     return ResponseDataMessage.ok("获取当前用户信息成功", adminInfoRespModel);
        // } else {
        //     return ResponseDataMessage.fail("获取当前用户信息失败");
        // }
        return DefaultDataResponse.ok(user);
    }
}
