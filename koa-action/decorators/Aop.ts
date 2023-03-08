import { Global, Aspect } from "../Global";

const advice = async function (target: any, method: any, args: any, aspect: Aspect, customData: any): Promise<any> {
    if (method) {
        let self = aspect.target;
        let joinPoint = {
            target: target,
            method: method.name,
            args,
            data: customData
        };

        // 前置增强
        aspect.before && aspect.before.call(self, joinPoint);
        // 环绕增强
        let roundJoinPoint = joinPoint;
        if (aspect.around) {
            roundJoinPoint = Object.assign(joinPoint, {
                handle: () => {
                    return Reflect.apply(method, target, args);
                }
            });
        }  else {
            // 没有声明round增强,直接执行原方法
            aspect.around = () => {
                return Reflect.apply(method, target, args);
            };
        }
        if (aspect.after || aspect.afterReturn || aspect.afterThrow) {
            let result = null;
            let error = null;
            try {
                result = await aspect.around.call(self, roundJoinPoint);
                // 返回增强
                return aspect.afterReturn && aspect.afterReturn.call(self, joinPoint, result) || result;
            } catch (e) {
                error = e;
                // 异常增强
                let shouldIntercept = aspect.afterThrow && aspect.afterThrow.call(self, joinPoint, e);
                if (!shouldIntercept) {
                    throw e;
                }
            } finally {
                // 后置增强
                aspect.after && aspect.after.call(self, joinPoint, result, error);
            }
        } else {
            // 未定义任何后置增强,直接执行原方法
            return aspect.around.call(self, roundJoinPoint);
        }
    }
}

export function Aspect (identity: string): ClassDecorator {
    return function (target: any) {
        let before = Reflect.getMetadata('ccc:aop:before', target);
        let around = Reflect.getMetadata('ccc:aop:around', target);
        let after = Reflect.getMetadata('ccc:aop:after', target);
        let afterReturn = Reflect.getMetadata('ccc:aop:afterreturn', target);
        let afterThrow = Reflect.getMetadata('ccc:aop:afterthrow', target);
        Global.aspects.set(identity, {
            target,
            before,
            around,
            after,
            afterReturn,
            afterThrow,
            advice
        });
    }
}

export function Before (): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:aop:before', target[key], target);
    }
}

export function After (): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:aop:after', target[key], target);
    }
}

export function AfterReturn (): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:aop:afterreturn', target[key], target);
    }
}

export function AfterThrow (): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:aop:afterthrow', target[key], target);
    }
}

export function Around (): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:aop:around', target[key], target);
    }
}