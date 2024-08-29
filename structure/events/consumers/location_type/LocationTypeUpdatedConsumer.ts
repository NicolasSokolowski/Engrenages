import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { locationTypeController } from "../../../app/controllers/index.controllers";
import { LocationTypeConsumerReq } from "../interfaces/LocationTypeConsumerReq";

export class LocationTypeUpdatedConsumer extends CoreConsumer<LocationTypeConsumerReq> {
  readonly routingKey = RoutingKeys.LocationTypeUpdated;
  queue = "typeUpdatedQueue";

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

          const updatedItem = await locationTypeController.datamapper.update(data, data.version);

          if (updatedItem) {
            console.log("Location type updated successfully");
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