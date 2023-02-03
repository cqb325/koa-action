export function Auth (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'auth',
        index: paramIndex
    };
};