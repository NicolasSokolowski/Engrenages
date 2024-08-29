import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { ConsumeMessage } from "amqplib";
import { locationController } from "../../../app/controllers/index.controllers";
import { LocationConsumerReq } from "../interfaces/LocationConsumerReq";

export class LocationDeletedConsumer extends CoreConsumer<LocationConsumerReq> {
  readonly routingKey = RoutingKeys.LocationDeleted;
  queue = "locationDeletedQueue";

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const deletedItem = await locationController.datamapper.delete(data.id);

          if (deletedItem) {
            console.log("Location deleted successfully");
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