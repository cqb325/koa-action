import './config';
import { KoaAction, ScanPath } from '../koa-action';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

@ScanPath('./src/controllers')
class Service extends KoaAction{
    constructor () {
        super();
    }
}
const s = new Service();
s.use(async (ctx: any, next: any) => {
    console.log(ctx.request.url);
    await next();
});
s.registerInterceptor(new AuthInterceptor()).run();