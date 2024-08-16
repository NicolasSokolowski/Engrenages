import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { ProductConsumerReq } from "../interfaces/product/ProductConsumerConsumerReq";
import { Channel, ConsumeMessage } from "amqplib";
import { productController } from "../../app/controllers/index.controllers";

export class ProductDeletedConsumer extends CoreConsumer<ProductConsumerReq> {
  readonly routingKey = RoutingKeys.ProductDeleted;
  queue = "productDeleteQueue";

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

          const deletedItem = await productController.datamapper.delete(data.id);

          if (!process.env.REDIS_HOST) {
            throw new Error("Redis host must be set")
          }

          console.log("Product deleted successfully");

          const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
          await redis.connect();

          if (deletedItem) {
            await redis.addResponse({ eventID: data.eventID, success: true });
          } else if (!deletedItem ) {
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