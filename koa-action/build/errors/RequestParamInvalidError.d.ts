import { HttpError } from "./HttpError";
export declare class RequestParamInvalidError extends HttpError {
    name: string;
    constructor(message?: string);
}
