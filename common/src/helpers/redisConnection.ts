import { RedisManager } from "../events/RedisManager";

export const redisConnection = async () => {
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be set");
  }

  const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
  await redis.connect();
  const redisSub = RedisManager.getSubInstance(process.env.REDIS_HOST, 6379);
  await redisSub.connect();

  return { redis, redisSub }
}