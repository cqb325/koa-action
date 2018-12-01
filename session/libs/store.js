const { randomBytes } = require('crypto');
const Configstore = require('configstore');

class Store {
    constructor() {
        this.config = new Configstore('./session.json');
        this.__timer = new Map();

        process.on('exit', (code) => {
            this.config.clear();
        });
    }

    getID(length) {
        return randomBytes(length).toString('hex');
    }

    get(sid) {
        if(!this.config.has(sid)) return undefined;
        // We are decoding data coming from our Store, so, we assume it was sanitized before storing
        return JSON.parse(this.config.get(sid));
    }

    set(session, { sid =  this.getID(24), maxAge } = {}) {
        // Just a demo how to use maxAge and some cleanup
        if (this.config.has(sid) && this.__timer.has(sid)) {
            const __timeout = this.__timer.get(sid);
            if (__timeout) clearTimeout(__timeout);
        }

        if (maxAge) {
            this.__timer.set(sid, setTimeout(() => this.destroy(sid), maxAge));
        }
        try {
            this.config.set(sid, JSON.stringify(session));
        } catch (err) {
            console.log('Set session error:', err);
        }

        return sid;
    }

    destroy(sid) {
        this.config.delete(sid);
    }
}

module.exports = Store;
