export function Controller (url: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata('ccc:rootPath', url, target);
    }
}