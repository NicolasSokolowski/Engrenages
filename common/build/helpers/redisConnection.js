"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const RedisManager_1 = require("../events/RedisManager");
const redisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.REDIS_HOST) {
        throw new Error("REDIS_HOST must be set");
    }
    const redis = RedisManager_1.RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
    yield redis.connect();
    const redisSub = RedisManager_1.RedisManager.getSubInstance(process.env.REDIS_HOST, 6379);
    yield redisSub.connect();
    return { redis, redisSub };
});
exports.redisConnection = redisConnection;
