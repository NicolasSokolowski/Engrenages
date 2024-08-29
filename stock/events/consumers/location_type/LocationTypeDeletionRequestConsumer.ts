import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationTypeConsumerReq } from "../../index.events";
import { locationController, locationTypeController } from "../../../app/controllers/index.controllers";

export class LocationTypeDeletionRequestConsumer extends CoreConsumer<LocationTypeConsumerReq> {
  readonly routingKey = RoutingKeys.LocationTypeDeletionRequest;
  queue = "typeDeleteQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationTypeController.getConfig("delete");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfUsed = await locationController.datamapper.checkIfUsed("location_type_name", data.name);

          if (checkIfUsed.length === 0) {
            const deletedItem = await locationTypeController.datamapper.delete(data.id);

            if (deletedItem) {
              console.log("Location type deleted successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            } else {
              console.log("Location type deletion failed.");
            }
          } else {
            console.log("Location type deletion failed.");
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