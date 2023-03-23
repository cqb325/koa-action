export interface IPageHelper<T> {
    getData(): T[];
    getTotal (): number;
    getPageNum (): number;
    getPageSize (): number;
    pageSize (pageSize: number): IPageHelper<T>;
    pageNum (pageNum: number): IPageHelper<T>;
    setRawQuery (sql: string, params: any[]): IPageHelper<T>;
}