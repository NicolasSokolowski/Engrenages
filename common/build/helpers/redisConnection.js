"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const RedisManager_1 = require("../events/RedisManager");
const redisConnection = async () => {
    if (!process.env.REDIS_HOST) {
        throw new Error("REDIS_HOST must be set");
    }
    const redis = RedisManager_1.RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
    await redis.connect();
    const redisSub = RedisManager_1.RedisManager.getSubInstance(process.env.REDIS_HOST, 6379);
    await redisSub.connect();
    return { redis, redisSub };
};
exports.redisConnection = redisConnection;
