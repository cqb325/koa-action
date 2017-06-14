const moment = require('moment');

module.exports = {
    /**
     * 日志
     * @param  {[type]} msg          [description]
     * @param  {String} [type="log"] [description]
     * @return {[type]}              [description]
     */
    log(msg, type="log"){
        if (typeof msg === 'string') {
            console[type](`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [KoaAction] ${msg}`);
        } else {
            console[type](msg);
        }
    }
}
