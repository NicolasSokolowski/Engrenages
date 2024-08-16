import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { ProductConsumerReq } from "../interfaces/product/ProductConsumerConsumerReq";
import { Channel, ConsumeMessage } from "amqplib";
import { productController } from "../../app/controllers/index.controllers";

export class ProductCheckConsumer extends CoreConsumer<ProductConsumerReq> {
  readonly routingKey = RoutingKeys.ProductCheck;
  queue = "productCheckQueue";

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

          const checkIfExists = await productController.datamapper.findBySpecificField("ean", data.ean);

          if (!process.env.REDIS_HOST) {
            throw new Error("Redis host must be set")
          }

          const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
          await redis.connect();

          if (checkIfExists) {
            await redis.addResponse({ eventID: data.eventID, success: false });
          } else if (checkIfExists === undefined) {
            await redis.addResponse({ eventID: data.eventID, success: true });
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