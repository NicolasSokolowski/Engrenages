import { RedisManager } from "../events/RedisManager";
export declare const redisConnection: () => Promise<{
    redis: RedisManager;
    redisSub: RedisManager;
}>;
