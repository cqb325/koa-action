import { registerBean } from "../Global";
/**
 * 标识Service类进行注册对象
 * @param Type 
 */
export function Service (Type: any): void {
    registerBean(Type, new Type());
}