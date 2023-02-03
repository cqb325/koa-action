# koa-action 2.0.0

koa2 mvc framework  easy to use

## Getting Started

npm install

```
npm install koa-action
```

yarn install

```
yarn add koa-action
```


##make dirs
    
	|-- src
	    |-- controllers		// controller目录
	    |-- entries			// typeorm entry 目录
	    |-- interceptors
	    |-- po				// Pojo Beans
	    |-- services		// services 
	    |-- config.ts		// 配置文件
	    |-- index.ts		// APP file

### index.ts
	
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

	//run
	npm run dev


### config.ts

	import { Global } from "../koa-action/Global";

	Global.config = {
		serviceName: 'fqbdService',
		port: 18080,
		dataSource: {
			type: "mysql",
			host: "172.21.46.186",
			port: 3306,
			username: "speedtest",
			password: "cmcc2021",
			database: "fqbd",
			entities: ['src/**/*.entity{.js,.ts}'],
			synchronize: false,
			logger: undefined, // 'advanced-console',
			logging: false //'all',
		},
		redis: {
			host: '127.0.0.1',
			port: 6379,
			password: '',
			db: 2
		},
		redisSession: {
			sessionOptions: {
				key: 'ka.sid',
				ttl: 5 * 60 * 1000  // 5分钟
			},
			redisOptions: {
				db: 2,
			}
		}
	};


# decorators
框架内置多个装饰器方便进行web开发

### @ScanPath('path')
类装饰器 指定controller路径

	@ScanPath('./src/controllers')
	class Service extends KoaAction{}

### @Controller('/path')
类装饰器 指定模块路由

	@Controller('/admin')
	class AdminController {}

### @Service
属性装饰器 注入该类型的对象，对应的对象只初始化一次，无传值

	@Service
    private adminService: AdminService;

### @Autowired
属性装饰器 注入该类型的对象，对应的对象只初始化一次， 无传值

	@Autowired
    private userDao: UserDao;

### @Get
函数装饰器method 为GET的路由

	@Get('/list')
    async list (@Param('name') a: string, @Headers headers: any):Promise<DataResponse> {}

### @Post
函数装饰器method 为POST的路由

	@Post('/add')
    async add (@Body user: User):Promise<DataResponse> {}

### @Put
函数装饰器method 为Put的路由

### @Delete
函数装饰器method 为Delete的路由

### @Head
函数装饰器method 为Head的路由

### @All
函数装饰器method 为All的路由

### @Status(200)
函数装饰器 指定要返回的状态码

### @ContentType('mimeType')
函数装饰器 指定要返回的content-type

### @Param('name')
属性装饰器 根据name属性获取url中的参数

	@Get('/list')
    async list (@Param('name') a: string, @Headers headers: any):Promise<DataResponse> {}

### @Headers
属性装饰器 获取request中的headers信息

	@Get('/list')
    async list (@Param('name') a: string, @Headers headers: any):Promise<DataResponse> {}

### @Body
属性装饰器 获取上传的Body中的信息

	@Post('/login')
    async login (@Body user: User, @Context ctx: any):Promise<DataResponse> {}

### @Context
属性装饰器 获取上下文对象

	@Post('/login')
    async login (@Body user: User, @Context ctx: any):Promise<DataResponse> {}

### @Request
属性装饰器 获取ctx.request对象

### @Response
属性装饰器 获取ctx.response对象

### @Cookies
属性装饰器 获取cookies对象

### @Cookie('key')
属性装饰器 获取cookies对象中指定的参数

### @Session
属性装饰器 获取session对象

### @SessionParam('key')
属性装饰器 获取session对象中的属性

### @Auth
属性装饰器 获取授权信息

### @Validate
属性装饰器 对属性进行校验，使用class-validator组件

	@Post('/add')
    async add (@Validate @Body a: User):Promise<DataResponse> {}

### 其他可以使用的业务模块
定时任务 agenda
消息队列 bull