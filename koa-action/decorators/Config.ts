export function Config (uri: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata('ccc:configPath', uri, target.prototype);
    }
}