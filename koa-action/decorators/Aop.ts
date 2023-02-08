let findPointCut = (target: any, pointCut: string): any => {
    if (typeof pointCut === 'string') {
        let func = target.prototype[pointCut];
        // 暂不支持属性的aop
        if (typeof func === 'function') {
            return func;
        }
    }
    // 暂不支持模糊匹配切点
    return null;
};

export function Aspect (targets: any[]): ClassDecorator {
    return function (target:any): void {
        let before = Reflect.getMetadata('ccc:aop:before', target);
        let around = Reflect.getMetadata('ccc:aop:around', target);
        let after = Reflect.getMetadata('ccc:aop:after', target);
        let afterReturn = Reflect.getMetadata('ccc:aop:afterreturn', target);
        let afterThrow = Reflect.getMetadata('ccc:aop:afterthrow', target);
        console.log(before);
        
        targets.forEach(targetType => {
            targetType.pointCuts && targetType.pointCuts.forEach((pointCut: string) => {
                let old = findPointCut(targetType.type, pointCut);
                console.log(old);
                
                if (old) {
                    targetType.type.prototype[pointCut] = async function () {
                        let self = this;
                        let args = arguments;
                        let joinPoint = {
                            target: targetType.type,
                            method: old,
                            args,
                            self
                        };

                        // 前置增强
                        before && before.call(self, joinPoint);
                        // 环绕增强
                        let roundJoinPoint = joinPoint;
                        if (around) {
                            roundJoinPoint = Object.assign(joinPoint, {
                                handle: () => {
                                    return old.apply(self, args);
                                }
                            });
                        }  else {
                            // 没有声明round增强,直接执行原方法
                            around = () => {
                                return old.apply(self, args);
                            };
                        }
                        if (after || afterReturn || afterThrow) {
                            let result = null;
                            let error = null;
                            try {
                                result = await around.call(self, roundJoinPoint);
                                // 返回增强
                                return afterReturn && afterReturn.call(self, joinPoint, result) || result;
                            } catch (e) {
                                error = e;
                                // 异常增强
                                let shouldIntercept = afterThrow && afterThrow.call(self, joinPoint, e);
                                if (!shouldIntercept) {
                                    throw e;
                                }
                            } finally {
                                // 后置增强
                                after && after.call(self, joinPoint, result, error);
                            }
                        } else {
                            // 未定义任何后置增强,直接执行原方法
                            return around.call(self, roundJoinPoint);
                        }
                    }
                }
            });
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