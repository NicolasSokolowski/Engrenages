import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { productBlockageController } from "../../app/controllers/index.controllers";
import { Channel, ConsumeMessage } from "amqplib";
import { ProductBlockageConsumerReq } from "../interfaces/product/ProductBlockageConsumer";

export class ProductBlockageCheckConsumer extends CoreConsumer<ProductBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.ProductBlockageCheck;
  queue = "productBlockageCheckQueue";

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

          const checkIfExists = await productBlockageController.datamapper.findBySpecificField("name", data.name);

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