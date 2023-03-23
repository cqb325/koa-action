"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Around = exports.AfterThrow = exports.AfterReturn = exports.After = exports.Before = exports.Aspect = void 0;
const Global_1 = require("../Global");
const advice = async function (target, method, args, aspect, customData) {
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
        }
        else {
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
            }
            catch (e) {
                error = e;
                // 异常增强
                let shouldIntercept = aspect.afterThrow && aspect.afterThrow.call(self, joinPoint, e);
                if (!shouldIntercept) {
                    throw e;
                }
            }
            finally {
                // 后置增强
                aspect.after && aspect.after.call(self, joinPoint, result, error);
            }
        }
        else {
            // 未定义任何后置增强,直接执行原方法
            return aspect.around.call(self, roundJoinPoint);
        }
    }
};
function Aspect(identity) {
    return function (target) {
        let before = Reflect.getMetadata('ccc:aop:before', target);
        let around = Reflect.getMetadata('ccc:aop:around', target);
        let after = Reflect.getMetadata('ccc:aop:after', target);
        let afterReturn = Reflect.getMetadata('ccc:aop:afterreturn', target);
        let afterThrow = Reflect.getMetadata('ccc:aop:afterthrow', target);
        Global_1.Global.aspects.set(identity, {
            target,
            before,
            around,
            after,
            afterReturn,
            afterThrow,
            advice
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
