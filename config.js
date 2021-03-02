module.exports = {
    database: {
        'host': '172.21.16.15',
        'port': 3306,
        'user': 'speedtest',
        'password': 'cmcc2018',
        'database': 'speedtest'
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
    // default
    formLimit: 56 * 1024,
    maxFileSize: 2 * 1024 * 1024,

    //中间件顺序
    middleware: ['database', 'koa-body']
}
