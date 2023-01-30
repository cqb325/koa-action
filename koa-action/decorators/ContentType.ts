export function ContentType (type: string): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:content-type', type, target, key);
    }
}