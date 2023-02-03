const { verify, TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
import { AuthorizationError } from "../../koa-action";
export class JwtUtil {
    static checkToken (publicKey: string, token: string, ctx: any): Promise<any> {
        return new Promise ((resolve) => {
            verify(token, publicKey, {algorithms: 'RS512'}, (err: any, decoded: string) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        throw new AuthorizationError(ctx, 'Authorization is expired');
                    } else if (err instanceof JsonWebTokenError) {
                        throw new AuthorizationError(ctx, 'Authorization token is invalid');
                    } else {
                        throw new AuthorizationError(ctx, 'Authorization is invalid');
                    }
                    resolve(false);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    static getUser (token: string) {

    }
}