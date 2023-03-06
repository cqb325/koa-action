import { IPageHelper } from './IPageHelper';
export type PageResponse = {
    data: any,
    code: number,
    message?: string,
    total: number,
    pageNum: number,
    pageSize: number
}

export class PageDataResponse{

    private static setData (data: any, code: number, total: number, pageNum: number, pageSize: number, message?: string):PageResponse {
        const res: PageResponse = {
            data,
            code,
            message,
            total,
            pageNum,
            pageSize
        };
        return res;
    }

    public static ok (page: IPageHelper<any>) : PageResponse {
        return this.setData(page.getData(), 200, page.getTotal(), page.getPageNum(), page.getPageSize(), '');
    }
    public static fail (message?: string): PageResponse {
        return this.setData('', 500, 0, 0, 0, message);
    }
    public static failWithCode (code: number): PageResponse {
        return this.setData('', code, 0, 0, 0, '');
    }
    public static failWithCodeMessage (code: number, message?: string): PageResponse {
        return this.setData('', code, 0, 0, 0, message);
    }
}