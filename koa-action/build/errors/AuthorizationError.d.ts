import { HttpError } from "./HttpError";
export declare class AuthorizationError extends HttpError {
    name: string;
    constructor(ctx: any, message?: string);
}
