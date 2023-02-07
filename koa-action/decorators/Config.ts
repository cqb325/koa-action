import { Global } from "../Global";
export function Config (target: any, key: any) {
    if (!Global.config) {
        throw new Error('import config to initialize Global.config in the first line');
    }
    target[key] = Global.config;
}