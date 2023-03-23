import { Global } from "../../koa-action/Global";
export function SysLog (moduleName: string): MethodDecorator {
    return function (target:any, key: any): void {
        Global.addAopPointCut('mycustom:aop:syslog', target, key, moduleName);
    }
}