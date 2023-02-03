import { Global } from "../Global";
export function ScanInterceptors (...urls: string[]): ClassDecorator {
    Global.interceptorsDirectories = urls;
    return function (target) {
        
    }
}