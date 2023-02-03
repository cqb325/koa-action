"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDataResponse = void 0;
class DefaultDataResponse {
    static setData(data, code, message) {
        const res = {
            data,
            code,
            message
        };
        return res;
    }
    static ok(data) {
        return this.setData(data, 200, '');
    }
    static fail(message) {
        return this.setData('', 500, message);
    }
    static failWithCode(code) {
        return this.setData('', code, '');
    }
    static failWithCodeMessage(code, message) {
        return this.setData('', code, message);
    }
}
exports.DefaultDataResponse = DefaultDataResponse;
