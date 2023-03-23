import { HttpError } from "./HttpError";
export declare class ForbiddenError extends HttpError {
    name: string;
    constructor(ctx: any);
}
