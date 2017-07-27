const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require(path.join(process.cwd(), 'config'));
const Context = require('./context');
const koaBody = require('koa-body')({
    multipart: true,
    uploadDir: config.upload,
    keepExtensions: true,
    maxFieldsSize: config.maxFileSize
});

module.exports = class KoaAction {

    constructor(options = {}){
        this.options = options;
        this.koa = new Koa();
        this.services = {};
        this.router = new Router();
        this.urlMap = {};
        this.init();
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */
    init(){
        //初始化错误处理
        this.initErrors();
        //加载Services
        this.loadServices();
        //初始化数据库
        this.loadMiddlewares();
        //初始化路由
        this.initRouters();
    }

    /**
     * 运行
     * @return {[type]} [description]
     */
    run(){
        this.koa.listen(config.port,()=>{
            console.log("server listen on "+config.port);
        });
    }

    /**
     * 初始化错误处理
     * @return {[type]} [description]
     */
    initErrors(){
        // 监控错误日志
        // this.koa.on('error', function (err, ctx) {
        //     utils.log(err);
        //     ctx.render('error', {
        //         code: ctx.status,
        //         err: err
        //     });
        // });

        // 捕获promise reject错误
        process.on('unhandledRejection', (reason, promise)=> {
            utils.log(reason);
        });

        // 捕获未知错误
        process.on('uncaughtException', function (err) {
            utils.log(err);
            if (err.message.indexOf(' EADDRINUSE ') > -1) {
                process.exit();
            }
        });
    }

    /**
     * 初始化路由
     * @return {[type]} [description]
     */
    initRouters(){
        let routerDir = path.join(config.root || process.cwd(), 'routers');
        if(fs.existsSync(routerDir)){
            fs.readdir(routerDir, (err, files)=>{
                files.forEach((file)=>{
                    let fileName = path.basename(file, path.extname(file));
                    let route = require(path.join(routerDir, fileName));
                    for(let urlPath in route){
                        this.urlMap[urlPath] = route[urlPath];
                        let matchURL = urlPath.split("!")[0];
                        matchURL = matchURL.startsWith("/") ? matchURL : "/"+matchURL;
                        let method = urlPath.split("!")[1];
                        method = method ? method : 'get';
                        method = method.toLowerCase();

                        this.handRouter(method, "/"+fileName+matchURL, route[urlPath]);
                    }
                });

                //bind routers
                this.koa.use(this.router.routes());
            });
        }
    }

    /**
     * 加载services
     * @return {[type]} [description]
     */
    loadServices(){
        let dir = path.join(config.root || process.cwd(), 'service');
        if(fs.existsSync(dir)){
            let files = fs.readdirSync(dir);
            files.forEach((file)=>{
                let fileName = path.basename(file, path.extname(file));
                this.services[fileName] = require(path.join(dir, fileName));
            });
        }
    }

    /**
     * 加载中间件
     * @return {[type]} [description]
     */
    loadMiddlewares(){
        //errors
        this.koa.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                err.status = err.statusCode || err.status || 500;
                throw err;
            }
        });

        let root = config.root || process.cwd();
        //favicon
        const favicon = require('koa-favicon');
        this.koa.use(favicon(path.join(root , config.favicon)));

        //static
        const koaStatic = require('koa-static');
        this.koa.use(koaStatic(path.join(root , config.static)));

        //compress
        const compress = require('koa-compress');
        this.koa.use(compress({
            flush: require('zlib').Z_SYNC_FLUSH
        }));

        //body
        // this.koa.use(koaBody);

        //session
        const session = require("koa-session2");
        this.koa.use(session({
            key: config.sessionKeys
        }));

        //ejs view
        const ejsRender = require('koa-ejs');
        ejsRender(this.koa, {
            root: path.join(root, config.views),
            layout: false,
            viewExt: 'html',
            cache: false,
            debug: true
        });

        let databasePath = path.join(config.root || process.cwd(), 'database/database');
        const database = require(databasePath);
        this.use(database);
    }

    /**
     * 处理Router
     * @param  {[type]} method   [description]
     * @param  {[type]} pathname [description]
     * @param  {[type]} handler  [description]
     * @return {[type]}          [description]
     */
    handRouter(method, pathname, handler){
        this.router[method](pathname, koaBody, async (ctx, next)=>{
            let kaCtx = new Context(ctx, this.urlMap);
            kaCtx.bindServices(this.services);
            await handler.apply(kaCtx,[]);
        });
    }

    /**
     * 使用中间件
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    use(fn) {
        this.koa.use(fn);
    }
}
