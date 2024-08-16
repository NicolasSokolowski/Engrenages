import { app } from "./app/index.app";
import { pool } from "./app/database/pg.client";
import { RabbitmqManager, RedisManager } from "@zencorp/engrenages";
import { LocationTypeCheckConsumer } from "./events/location_type/LocationTypeCheckConsumer";
import { LocationTypeCreatedConsumer } from "./events/location_type/LocationTypeCreatedConsumer";
import { LocationTypeUpdatedConsumer } from "./events/location_type/LocationTypeUpdatedConsumer";
import { LocationTypeDeletedConsumer } from "./events/location_type/LocationTypeDeletedConsumer";
import { LocationBlockageCheckConsumer } from "./events/location_blockage/LocationBlockageCheckConsumer";
import { LocationBlockageCreatedConsumer } from "./events/location_blockage/LocationBlockageCreatedConsumer";
import { LocationBlockageUpdatedConsumer } from "./events/location_blockage/LocationBlockageUpdatedConsumer";
import { LocationBlockageDeletedConsumer } from "./events/location_blockage/LocationBlockageDeletedConsumer";
import { LocationCheckConsumer } from "./events/location/LocationCheckConsumer";
import { LocationCreatedConsumer } from "./events/location/LocationCreatedConsumer";
import { LocationUpdatedConsumer } from "./events/location/LocationUpdatedConsumer";
import { LocationDeletedConsumer } from "./events/location/LocationDeletedConsumer";
import { ProductBlockageCheckConsumer } from "./events/product_blockage/ProductBlockageCheckConsumer";
import { ProductBlockageCreatedConsumer } from "./events/product_blockage/ProductBlockageCreatedConsumer";
import { ProductBlockageUpdatedConsumer } from "./events/product_blockage/ProductBlockageUpdatedConsumer";
import { ProductBlockageDeletedConsumer } from "./events/product_blockage/ProductBlockageDeletedConsumer";
import { ProductCheckConsumer } from "./events/product/ProductCheckConsumer";
import { ProductCreatedConsumer } from "./events/product/ProductCreatedConsumer";
import { ProductUpdateConsumer } from "./events/product/ProductUpdatedConsumer";
import { ProductDeletedConsumer } from "./events/product/ProductDeletedConsumer";

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
    const rabbitmqSubChan = rabbitMQ.getSubChannel();
    console.log("Connected to RabbitMQ");

    const exchange = "logisticExchange";

    new LocationTypeCheckConsumer(rabbitmqSubChan, exchange).consume();
    new LocationTypeCreatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationTypeUpdatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationTypeDeletedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationBlockageCreatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationBlockageCheckConsumer(rabbitmqSubChan, exchange).consume();
    new LocationBlockageUpdatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationBlockageDeletedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationCheckConsumer(rabbitmqSubChan, exchange).consume();
    new LocationCreatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationUpdatedConsumer(rabbitmqSubChan, exchange).consume();
    new LocationDeletedConsumer(rabbitmqSubChan, exchange).consume();
    new ProductBlockageCheckConsumer(rabbitmqSubChan, exchange).consume();
    new ProductBlockageCreatedConsumer(rabbitmqSubChan, exchange).consume();
    new ProductBlockageUpdatedConsumer(rabbitmqSubChan, exchange).consume();
    new ProductBlockageDeletedConsumer(rabbitmqSubChan, exchange).consume();
    new ProductCheckConsumer(rabbitmqSubChan, exchange).consume();
    new ProductCreatedConsumer(rabbitmqSubChan, exchange).consume();
    new ProductUpdateConsumer(rabbitmqSubChan, exchange).consume();
    new ProductDeletedConsumer(rabbitmqSubChan, exchange).consume();

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