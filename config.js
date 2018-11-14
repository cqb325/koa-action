module.exports = {
    database: {
        'host': '127.0.0.1',
        'port': 3306,
        'user': 'root',
        'password': '123456',
        'database': 'cmui'
    },
    dev: true,
    port: 3000,
    root: '',
    favicon: '/static/favicon.ico',
    static: '/static',
    sessionKeys: 'koa-action',
    views: '/views',
    //upload file dir
    upload: '/static/upload',
    maxFileSize: 2 * 1024 * 1024,

    //中间件顺序
    middleware: ['database', 'koa-body']
}
