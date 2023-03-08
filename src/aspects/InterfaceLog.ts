import { Aspect, Before, After, Around } from "../../koa-action";
import UserController from "../controllers/user.controller";

// @Aspect([{type: UserController, pointCuts: ['list']}])
@Aspect('mycustom:aop:syslog')
export class InterfaceLog {

    @Before()
    static logBefore (point: any) {
        console.log('before', point);
    }

    @After()
    static logAfter (joinPoint: any, result: any, error: Error) {
        console.log('after', joinPoint, result, error);
    }

    @Around()
    static async logAround (joinPoint: any) {
        const ret = await joinPoint.handle();
        return ret;
    }
}