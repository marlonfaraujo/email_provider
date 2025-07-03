import IORedis from 'ioredis';
import CacheConnectionAbstraction from './CacheConnectionAbstraction';

export default class RedisConnection implements CacheConnectionAbstraction {

    private readonly redis: IORedis;

    constructor() {
        this.redis = new IORedis({
            host: process.env.REDIS_HOST ?? "localhost",
            port: Number(process.env.REDIS_PORT ?? 6379),
        });
    }

}