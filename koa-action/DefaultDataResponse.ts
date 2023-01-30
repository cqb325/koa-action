export type DataResponse = {
    data: any,
    code: number,
    message?: string
}

export class DefaultDataResponse{

    private static setData (data: any, code: number, message?: string):DataResponse {
        const res: DataResponse = {
            data,
            code,
            message
        };
        return res;
    }

    public static ok (data: any) : DataResponse {
        return this.setData(data, 200, '');
    }
    public static fail (message?: string): DataResponse {
        return this.setData('', 500, message);
    }
    public static failWithCode (code: number): DataResponse {
        return this.setData('', code, '');
    }
    public static failWithCodeMessage (code: number, message?: string): DataResponse {
        return this.setData('', code, message);
    }
}