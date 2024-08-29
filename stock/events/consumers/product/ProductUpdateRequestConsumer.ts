import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { ProductConsumerReq } from "../../index.events";
import { productController } from "../../../app/controllers/index.controllers";

export class ProductUpdateRequestConsumer extends CoreConsumer<ProductConsumerReq> {
  readonly routingKey = RoutingKeys.ProductUpdateRequest;
  queue = "productUpdateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = productController.getConfig("update");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfExists = await productController.datamapper.findByPk(data.id);
          const checkIfEanExists = await productController.datamapper.findBySpecificField("ean", data.ean);
          const checkIfTitleExists = await productController.datamapper.findBySpecificField("title", data.title);

          if (checkIfExists && !checkIfEanExists && !checkIfTitleExists) {
            const updatedItem = await productController.datamapper.update(data, data.version);

            if (updatedItem) {
              console.log("Product updated successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            } else {
              console.log("Product update failed.");
            }
          } else {
            console.log("Product update failed.");
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