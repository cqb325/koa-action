import './config';
import { KoaAction, ScanPath, Log } from '../koa-action';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

@ScanPath('./src/controllers')
class Service extends KoaAction{
    @Log()
    private log: any;

    constructor () {
        super();

        this.init();
    }

    init () {
        this.registerInterceptor(new AuthInterceptor())
            .run();
    }
}
const s = new Service();