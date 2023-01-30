"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.All = exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
function Get(url) {
    return fn(url, 'get');
}
exports.Get = Get;
function Post(url) {
    return fn(url, 'post');
}
exports.Post = Post;
function Put(url) {
    return fn(url, 'put');
}
exports.Put = Put;
function Delete(url) {
    return fn(url, 'del');
}
exports.Delete = Delete;
function All(url) {
    return fn(url, 'all');
}
exports.All = All;
function fn(url, method) {
    return function (target, propertyKey) {
        const route = {
            method,
            url,
            handler: propertyKey
        };
        if (!Reflect.hasMetadata('ccc:routes', target)) {
            Reflect.defineMetadata('ccc:routes', [], target);
        }
        const routes = Reflect.getMetadata('ccc:routes', target);
        routes.push(route);
    };
}