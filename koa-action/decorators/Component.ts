import { registerBean } from "../Global";
/**
 * 标识类进行注册对象
 * @param Type 
 */
export function Component (Type: any): void {
    registerBean(Type, new Type());
}