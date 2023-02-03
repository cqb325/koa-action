"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanInterceptor = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
class ScanInterceptor {
    constructor(dirs) {
        this.interceptors = [];
        this.dirs = dirs;
    }
    scan() {
        if (typeof this.dirs === 'string') {
            this.doScanInterceptor(this.dirs);
        }
        else {
            this.dirs.forEach((cur) => {
                this.doScanInterceptor(cur);
            });
        }
    }
    doScanInterceptor(dir) {
        let moduleDir = node_path_1.default.join(process.cwd(), dir);
        try {
            if (node_fs_1.default.existsSync(moduleDir)) {
                const files = node_fs_1.default.readdirSync(moduleDir);
                files.forEach((file) => {
                    let fileName = node_path_1.default.basename(file, node_path_1.default.extname(file));
                    const Module = require(node_path_1.default.resolve(moduleDir, fileName));
                    this.interceptors.push(new Module());
                });
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.ScanInterceptor = ScanInterceptor;
