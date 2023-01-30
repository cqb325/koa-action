import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { KoaAction, ScanPath, Config } from '../koa-action';

@ScanPath('./src/controllers')
@Config('./src/config.ts')
class Service extends KoaAction{
    constructor () {
        super();

        this.registerDataSource();
    }
}
const s = new Service();
s.registerInterceptor(new AuthInterceptor({secret: 'shared-secret'})).run();
