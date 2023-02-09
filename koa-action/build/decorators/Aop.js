"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Around = exports.AfterThrow = exports.AfterReturn = exports.After = exports.Before = exports.Aspect = void 0;
let findPointCut = (target, pointCut) => {
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
function Aspect(targets) {
    return function (target) {
        let before = Reflect.getMetadata('ccc:aop:before', target);
        let around = Reflect.getMetadata('ccc:aop:around', target);
        let after = Reflect.getMetadata('ccc:aop:after', target);
        let afterReturn = Reflect.getMetadata('ccc:aop:afterreturn', target);
        let afterThrow = Reflect.getMetadata('ccc:aop:afterthrow', target);
        console.log(before);
        targets.forEach(targetType => {
            targetType.pointCuts && targetType.pointCuts.forEach((pointCut) => {
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
                        }
                        else {
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
                            }
                            catch (e) {
                                error = e;
                                // 异常增强
                                let shouldIntercept = afterThrow && afterThrow.call(self, joinPoint, e);
                                if (!shouldIntercept) {
                                    throw e;
                                }
                            }
                            finally {
                                // 后置增强
                                after && after.call(self, joinPoint, result, error);
                            }
                        }
                        else {
                            // 未定义任何后置增强,直接执行原方法
                            return around.call(self, roundJoinPoint);
                        }
                    };
                }
            });
        });
    };
}
exports.Aspect = Aspect;
function Before() {
    return function (target, key) {
        Reflect.defineMetadata('ccc:aop:before', target[key], target);
    };
}
exports.Before = Before;
function After() {
    return function (target, key) {
        Reflect.defineMetadata('ccc:aop:after', target[key], target);
    };
}
exports.After = After;
function AfterReturn() {
    return function (target, key) {
        Reflect.defineMetadata('ccc:aop:afterreturn', target[key], target);
    };
}
exports.AfterReturn = AfterReturn;
function AfterThrow() {
    return function (target, key) {
        Reflect.defineMetadata('ccc:aop:afterthrow', target[key], target);
    };
}
exports.AfterThrow = AfterThrow;
function Around() {
    return function (target, key) {
        Reflect.defineMetadata('ccc:aop:around', target[key], target);
    };
}
exports.Around = Around;
