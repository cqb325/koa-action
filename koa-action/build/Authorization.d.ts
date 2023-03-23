export declare class Authorization {
    private data;
    private permits;
    private authorized;
    setData(data: any): void;
    getData(): any;
    setPermits(permits: any): void;
    setAuthorized(authorized: boolean): void;
    isAuthorized(): boolean;
}
