export function AutoRepository (Class: any) {
    return function (target: any, propertyKey: any): void {
        const { ds } = require("../App");
        target[propertyKey] = ds.getRepository(Class);
    }
}