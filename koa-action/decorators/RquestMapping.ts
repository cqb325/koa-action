import { Route } from "../types";

export function Get (url:string): MethodDecorator {
    return fn(url, 'get');
}

export function Post (url:string): MethodDecorator {
    return fn(url, 'post');
}

export function Put (url:string): MethodDecorator {
    return fn(url, 'put');
}

export function Delete (url:string): MethodDecorator {
    return fn(url, 'del');
}

export function All (url:string): MethodDecorator {
    return fn(url, 'all');
}

function fn (url:string, method:string): MethodDecorator{
    return function (target: any, propertyKey: any) {
        const route: Route = {
            method,
            url,
            handler: propertyKey
        }
        if (!Reflect.hasMetadata('ccc:routes', target)) {
            Reflect.defineMetadata('ccc:routes', [], target);
        }
        const routes = Reflect.getMetadata('ccc:routes', target);
        routes.push(route);
    }
}