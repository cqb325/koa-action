var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "reflect-metadata", "./App", "./BaseInterceptor", "./DefaultDataResponse", "./decorators", "./errors/AuthorizationError", "./errors/ForbiddenError", "./errors/HttpError", "./errors/RequestParamInvalidError", "./Authorization", "./BaseController", "./Interceptor", "./redis", "./IPageHelper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("reflect-metadata");
    __exportStar(require("./App"), exports);
    __exportStar(require("./BaseInterceptor"), exports);
    __exportStar(require("./DefaultDataResponse"), exports);
    __exportStar(require("./decorators"), exports);
    __exportStar(require("./errors/AuthorizationError"), exports);
    __exportStar(require("./errors/ForbiddenError"), exports);
    __exportStar(require("./errors/HttpError"), exports);
    __exportStar(require("./errors/RequestParamInvalidError"), exports);
    __exportStar(require("./Authorization"), exports);
    __exportStar(require("./BaseController"), exports);
    __exportStar(require("./Interceptor"), exports);
    __exportStar(require("./redis"), exports);
    __exportStar(require("./IPageHelper"), exports);
});
