var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./decorators", "node:fs", "node:path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuleScanner = void 0;
    const decorators_1 = require("./decorators");
    const node_fs_1 = __importDefault(require("node:fs"));
    const node_path_1 = __importDefault(require("node:path"));
    /**
     * 模块扫描和加载
     */
    class ModuleScanner {
        constructor(root, dirs, handler) {
            this.root = root;
            this.dirs = dirs;
            this.handler = handler;
        }
        /**
         * 逐级扫描目录加载模块
         */
        scan() {
            this._doScan(this.dirs, '');
        }
        _doScan(dirs, parent) {
            dirs.forEach((cur) => {
                const curPath = node_path_1.default.resolve(this.root, parent, cur);
                if (node_fs_1.default.existsSync(curPath)) {
                    const stat = node_fs_1.default.statSync(curPath);
                    if (stat.isFile()) {
                        let fileName = node_path_1.default.basename(curPath, node_path_1.default.extname(curPath));
                        this.log.debug(`start load module ${curPath}`);
                        const module = require(curPath);
                        const Clazz = module.default || module;
                        this.handler && this.handler(Clazz, fileName);
                    }
                    else {
                        const files = node_fs_1.default.readdirSync(curPath);
                        this._doScan(files, cur);
                    }
                }
                else {
                    this.log.warn(`cannt load module ${curPath} path is not exit`);
                }
            });
        }
    }
    __decorate([
        (0, decorators_1.Log)(),
        __metadata("design:type", Object)
    ], ModuleScanner.prototype, "log", void 0);
    exports.ModuleScanner = ModuleScanner;
});
