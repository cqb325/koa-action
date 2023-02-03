export function Session (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'session',
        index: paramIndex
    };
};

export function SessionParam (name:string): ParameterDecorator {
    return function (target:any, key:any, paramIndex: number) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'sessionParam',
            name,
            index: paramIndex
        };
    };
}