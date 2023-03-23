import { IPageHelper } from './IPageHelper';
export type PageResponse = {
    data: any;
    code: number;
    message?: string;
    total: number;
    pageNum: number;
    pageSize: number;
};
export declare class PageDataResponse {
    private static setData;
    static ok(page: IPageHelper<any>): PageResponse;
    static fail(message?: string): PageResponse;
    static failWithCode(code: number): PageResponse;
    static failWithCodeMessage(code: number, message?: string): PageResponse;
}
