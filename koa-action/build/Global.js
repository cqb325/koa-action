(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBean = exports.registerBean = exports.Global = void 0;
    class Global {
    }
    exports.Global = Global;
    Global.beans = new Map();
    Global.aspects = new Map();
    Global.addAopPointCut = (key, target, method, data) => {
        if (!Reflect.hasMetadata('ccc:pointcuts', target, method)) {
            Reflect.defineMetadata('ccc:pointcuts', [], target, method);
        }
        const pointcuts = Reflect.getMetadata('ccc:pointcuts', target, method);
        pointcuts.push({
            key,
            data
        });
    };
    /**
     * 注册实例化对象
     * @param type 对象的类型
     * @param instance 对象实例
     */
    function registerBean(type, instance) {
        Global.beans.set(type, instance);
    }
    exports.registerBean = registerBean;
    /**
     * 从容器中获取实例
     * @param type 对象类型
     * @returns
     */
    function getBean(type) {
        const typeSet = Global.beans.keys();
        let key = typeSet.next();
        while (!key.done) {
            if (key.value == type || key.value.__proto__ == type) {
                return Global.beans.get(key.value);
            }
            key = typeSet.next();
        }
        return null;
    }
    exports.getBean = getBean;
});
