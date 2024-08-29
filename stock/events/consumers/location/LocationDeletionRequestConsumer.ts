import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { ConsumeMessage } from "amqplib";
import { LocationConsumerReq } from "../../index.events";
import { locationController } from "../../../app/controllers/index.controllers";

export class LocationDeletionRequestConsumer extends CoreConsumer<LocationConsumerReq> {
  readonly routingKey = RoutingKeys.LocationDeletionRequest;
  queue = "locationDeleteQueue";

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationController.getConfig("delete");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfUsed = await locationController.datamapper.checkIfNotNull("ean", data.id);

          if (checkIfUsed.length === 0) {
            const deletedItem = await locationController.datamapper.delete(data.id);

            if (deletedItem) {
              console.log("Location deleted successfully");
              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
              
            } else {
              console.log("Location deletion failed.");
            }
          } else {
            console.log("Location deletion failed.");
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