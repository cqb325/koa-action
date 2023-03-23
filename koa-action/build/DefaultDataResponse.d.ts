export type DataResponse = {
    data: any;
    code: number;
    message?: string;
};
export declare class DefaultDataResponse {
    private static setData;
    static ok(data: any): DataResponse;
    static fail(message?: string): DataResponse;
    static failWithCode(code: number): DataResponse;
    static failWithCodeMessage(code: number, message?: string): DataResponse;
}
