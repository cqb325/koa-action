import Redis from 'ioredis';
import { Global } from '../Global';
import { Component } from '../decorators/Component';

@Component
export class RedisTemplate extends Redis {
    constructor () {
        super(Global.config.redis || {});
    }
}