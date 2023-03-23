"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageDataResponse = void 0;
class PageDataResponse {
    static setData(data, code, total, pageNum, pageSize, message) {
        const res = {
            data,
            code,
            message,
            total,
            pageNum,
            pageSize
        };
        return res;
    }
    static ok(page) {
        return this.setData(page.getData(), 200, page.getTotal(), page.getPageNum(), page.getPageSize(), '');
    }
    static fail(message) {
        return this.setData('', 500, 0, 0, 0, message);
    }
    static failWithCode(code) {
        return this.setData('', code, 0, 0, 0, '');
    }
    static failWithCodeMessage(code, message) {
        return this.setData('', code, 0, 0, 0, message);
    }
}
exports.PageDataResponse = PageDataResponse;
