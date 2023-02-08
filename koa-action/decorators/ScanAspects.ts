import { Global } from "../Global";
export function ScanAspects (...urls: string[]): ClassDecorator {
    Global.aspectsDirectories = urls;
    return function (target) {
        
    }
}