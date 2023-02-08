import './config';
import { KoaAction, ScanPath, Log, ScanAspects } from '../koa-action';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

@ScanPath('./src/controllers')
@ScanAspects('./src/aspects')
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