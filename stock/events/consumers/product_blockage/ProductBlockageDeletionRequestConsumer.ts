import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { ProductBlockageConsumerReq } from "../../index.events";
import { productBlockageController, productController } from "../../../app/controllers/index.controllers";

export class ProductBlockageDeletionRequestConsumer extends CoreConsumer<ProductBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.ProductBlockageDeletionRequest;
  queue = "productBlockageDeleteQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = productBlockageController.getConfig("delete");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfUsed = await productController.datamapper.checkIfUsed("product_blockage_name", data.name);

          if (checkIfUsed.length === 0) {
            const deletedItem = await productBlockageController.datamapper.delete(data.id);

            if (deletedItem) {
              console.log("Product blockage deleted successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            } else {
              console.log("Product blockage deletion failed.");
            }
          } else {
            console.log("Product blockage deletion failed.");
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