export function Validate (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:validates', target, key)) {
        Reflect.defineMetadata('ccc:validates', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:validates', target, key);
    fileds[paramIndex] = true;
}