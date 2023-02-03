import { Global } from "../Global";
export function Autowired (target: any, propertyKey: any): void {
    const Type = Reflect.getMetadata('design:type', target, propertyKey);
    if (!Global.beans.has(Type)) {
        Global.beans.set(Type, new Type());
    }
    target[propertyKey] = Global.beans.get(Type);
}