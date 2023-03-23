"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = exports.Cookie = exports.Context = exports.Body = exports.Headers = exports.Response = exports.Request = exports.File = exports.Param = void 0;
function Param(name) {
    return function (target, key, paramIndex) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'param',
            name,
            index: paramIndex
        };
    };
}
exports.Param = Param;
function File(name) {
    return function (target, key, paramIndex) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'file',
            name,
            index: paramIndex
        };
    };
}
exports.File = File;
function Request(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'req',
        index: paramIndex
    };
}
exports.Request = Request;
function Response(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'res',
        index: paramIndex
    };
}
exports.Response = Response;
function Headers(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'headers',
        index: paramIndex
    };
}
exports.Headers = Headers;
function Body(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const types = Reflect.getMetadata('design:paramtypes', target, key);
    console.log('pram type', types[paramIndex].name);
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'body',
        index: paramIndex,
        Class: types[paramIndex]
    };
}
exports.Body = Body;
function Context(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'ctx',
        index: paramIndex
    };
}
exports.Context = Context;
function Cookie(name) {
    return function (target, key, paramIndex) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'cookie',
            name,
            index: paramIndex
        };
    };
}
exports.Cookie = Cookie;
function Cookies(target, key, paramIndex) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'cookies',
        index: paramIndex
    };
}
exports.Cookies = Cookies;
