import { getBean } from "../Global";
export function Autowired (target: any, propertyKey: any): void {
    const Type = Reflect.getMetadata('design:type', target, propertyKey);
    target[propertyKey] = getBean(Type);
}