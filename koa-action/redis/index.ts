import Redis from 'ioredis';
import { Global } from '../Global';
export class RedisTemplate extends Redis {
    constructor () {
        super(Global.config.redis || {});
    }
}