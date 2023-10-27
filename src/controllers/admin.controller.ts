import { Controller, Get, Post, Param, Headers, ContentType, Body, Context, Validate, DefaultDataResponse, DataResponse, Autowired } from "../../koa-action";
import { AdminService } from "../services/AdminService";
import { User } from "../po/User";

@Controller('/admin')
class AdminController {

    @Autowired
    private adminService: AdminService;
    
    @ContentType('text/plain')
    @Get('/list')
    async list (@Param('name') a: string, @Headers headers: any):Promise<DataResponse> {
        // console.log(headers);
        // this.send(this.as.list().join(','));
        console.log('controller list');

        const list = await this.adminService.listPhotos();
        console.log(list);
        
        
        return DefaultDataResponse.ok(this.adminService.list().join(','));
    }

    @Post('/add')
    async add (@Validate @Body a: User):Promise<DataResponse> {
        // console.log(headers);
        // this.send(this.as.list().join(','));
        console.log('controller add', a);
        return DefaultDataResponse.ok(a);
    }

    @Post('/login')
    async login (@Body user: User, @Context ctx: any):Promise<DataResponse> {
        const token = this.adminService.login(user);
        console.log('AuthToekn', 'Bearer ' + token);
        // ctx.session.capcha = '12345';
        
        return DefaultDataResponse.ok(user);
    }

    @Get('/void')
    async void (@Param('name') a: string, @Context ctx: any):Promise<string> {
        console.log('controller void');
        return this.adminService.list().join(',');
    }
}

export default AdminController;
