import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { ProductConsumerReq } from "../interfaces/product/ProductConsumerConsumerReq";
import { Channel, ConsumeMessage } from "amqplib";
import { productController } from "../../app/controllers/index.controllers";

export class ProductCreatedConsumer extends CoreConsumer<ProductConsumerReq> {
  readonly routingKey = RoutingKeys.ProductCreated
  queue = "productCreateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const createdItem = await productController.datamapper.insert(data);

          if (!process.env.REDIS_HOST) {
            throw new Error("Redis host must be set")
          }

          console.log("Product created successfully");

          const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
          await redis.connect();

          if (createdItem) {
            await redis.addResponse({ eventID: data.eventID, success: true });
          } else if (createdItem === undefined) {
            await redis.addResponse({ eventID: data.eventID, success: false });
          }

          this.channel.ack(msg);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.warn("Received null message");
      }
    })
  }
}