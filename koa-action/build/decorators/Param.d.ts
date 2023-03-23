export declare function Param(name: string): ParameterDecorator;
export declare function File(name: string): ParameterDecorator;
export declare function Request(target: any, key: any, paramIndex: number): void;
export declare function Response(target: any, key: any, paramIndex: number): void;
export declare function Headers(target: any, key: any, paramIndex: number): void;
export declare function Body(target: any, key: any, paramIndex: number): void;
export declare function Context(target: any, key: any, paramIndex: number): void;
export declare function Cookie(name: string): ParameterDecorator;
export declare function Cookies(target: any, key: any, paramIndex: number): void;
