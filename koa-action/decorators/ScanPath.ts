export function ScanPath (...urls: string[]): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata('ccc:scanDirectories', urls, target.prototype);
    }
}