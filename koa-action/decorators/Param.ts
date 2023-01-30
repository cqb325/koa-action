export function Param (name:string): ParameterDecorator {
    return function (target:any, key:any, paramIndex: number) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'param',
            name,
            index: paramIndex
        };
    };
}

export function Request (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'req',
        index: paramIndex
    };
}

export function Response (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'res',
        index: paramIndex
    };
}

export function Headers (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'headers',
        index: paramIndex
    };
}

export function Body (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const types = Reflect.getMetadata('design:paramtypes', target, key);
    console.log('pram type', types[paramIndex].name);
    
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'body',
        index: paramIndex,
        Class: types[paramIndex]
    };
}

export function Context (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'ctx',
        index: paramIndex
    };
}

export function Cookie (name:string): ParameterDecorator {
    return function (target:any, key:any, paramIndex: number) {
        if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
            Reflect.defineMetadata('ccc:fileds', [], target, key);
        }
        const fileds = Reflect.getMetadata('ccc:fileds', target, key);
        fileds[paramIndex] = {
            type: 'cookie',
            name,
            index: paramIndex
        };
    }
}

export function Cookies (target:any, key:any, paramIndex: number) {
    if (!Reflect.hasMetadata('ccc:fileds', target, key)) {
        Reflect.defineMetadata('ccc:fileds', [], target, key);
    }
    const fileds = Reflect.getMetadata('ccc:fileds', target, key);
    fileds[paramIndex] = {
        type: 'cookies',
        index: paramIndex
    };
}