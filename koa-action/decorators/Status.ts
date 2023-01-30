export function Status (code: number): MethodDecorator {
    return function (target:any, key: any): void {
        Reflect.defineMetadata('ccc:status-code', code, target, key);
    }
}