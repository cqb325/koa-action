import { Global } from "../Global";
export function AutoRepository (Class: any) {
    return function (target: any, propertyKey: any): void {
        if (Global.dataSource) {
            target[propertyKey] = Global.dataSource.getRepository(Class);
        }
    }
}