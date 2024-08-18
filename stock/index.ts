import { app } from "./app/index.app";
import { pool } from "./app/database/pg.client";
import { RabbitmqManager, RedisManager } from "@zencorp/engrenages";
import { LocationTypeCreatedConsumer } from "./events/location_type/LocationTypeCreatedConsumer";
import { LocationTypeUpdatedConsumer } from "./events/location_type/LocationTypeUpdatedConsumer";
import { LocationTypeDeletedConsumer } from "./events/location_type/LocationTypeDeletedConsumer";
import { LocationBlockageCreatedConsumer } from "./events/location_blockage/LocationBlockageCreatedConsumer";
import { LocationBlockageUpdatedConsumer } from "./events/location_blockage/LocationBlockageUpdatedConsumer";
import { LocationBlockageDeletedConsumer } from "./events/location_blockage/LocationBlockageDeletedConsumer";
import { LocationCreatedConsumer } from "./events/location/LocationCreatedConsumer";
import { LocationUpdatedConsumer } from "./events/location/LocationUpdatedConsumer";
import { LocationDeletedConsumer } from "./events/location/LocationDeletedConsumer";
import { ProductBlockageCreatedConsumer } from "./events/product_blockage/ProductBlockageCreatedConsumer";
import { ProductBlockageUpdatedConsumer } from "./events/product_blockage/ProductBlockageUpdatedConsumer";
import { ProductBlockageDeletedConsumer } from "./events/product_blockage/ProductBlockageDeletedConsumer";
import { ProductCreatedConsumer } from "./events/product/ProductCreatedConsumer";
import { ProductUpdateConsumer } from "./events/product/ProductUpdatedConsumer";
import { ProductDeletedConsumer } from "./events/product/ProductDeletedConsumer";
import { consumersSetup } from "./helpers/consumersSetup";

const start = async () => {
  pool.query('SELECT 1;', (err: Error, res: any) => {
    if (err) {
      console.error('Failed to connect to the database: ', err);
      process.exit(1);
    } else {
      console.log('Connected to the database!');
    }
  });

  try {
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    console.log("Connected to RabbitMQ");

    await consumersSetup();

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }

    const redis = new RedisManager(process.env.REDIS_HOST, 6379);
    await redis.connect();
    console.log("Connected to Redis");
    
    process.on("SIGINT", async () => {
      await rabbitMQ.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await rabbitMQ.close();
      process.exit(0);
    });
    
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();