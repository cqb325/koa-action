import { Aspect, Before, After } from "../../koa-action";
import UserController from "../controllers/user.controller";

@Aspect([{type: UserController, pointCuts: ['list']}])
export class InterfaceLog {

    @Before()
    static logBefore (point: any) {
        console.log('before', point);
        
    }

    @After()
    static logAfter (joinPoint: any, result: any, error: Error) {
        console.log('after', joinPoint, result, error);
    }
}