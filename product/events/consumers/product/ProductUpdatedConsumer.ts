import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { productController } from "../../../app/controllers/index.controllers";
import { ProductConsumerReq } from "../interfaces/ProductConsumerReq";

export class ProductUpdatedConsumer extends CoreConsumer<ProductConsumerReq> {
  readonly routingKey = RoutingKeys.ProductUpdated;
  queue = "productUpdatedQueue";

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
          
          const updatedItem = await productController.datamapper.update(data, data.version);

          if (updatedItem) {
            console.log("Product updated successfully");
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