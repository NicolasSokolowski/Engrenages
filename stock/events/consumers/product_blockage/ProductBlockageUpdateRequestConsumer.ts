import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { ProductBlockageConsumerReq } from "../../index.events";
import { productBlockageController } from "../../../app/controllers/index.controllers";

export class ProductBlockageUpdateRequestConsumer extends CoreConsumer<ProductBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.ProductBlockageUpdateRequest;
  queue = "productBlockageUpdateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = productBlockageController.getConfig("update");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfExists = await productBlockageController.datamapper.findByPk(data.id);
          const checkIfItemExists = await productBlockageController.datamapper.findBySpecificField("name", data.name);

          if (checkIfExists && !checkIfItemExists) {
            const updatedItem = await productBlockageController.datamapper.update(data, data.version);

            if (updatedItem) {
              console.log("Product blockage updated successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            } else {
              console.log("Product blockage update failed.");
            }
          } else {
            console.log("Product blockage update failed.");
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