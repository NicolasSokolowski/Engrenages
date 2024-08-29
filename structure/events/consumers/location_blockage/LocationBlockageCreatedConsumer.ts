import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { locationBlockageController } from "../../../app/controllers/index.controllers";
import { LocationBlockageConsumerReq } from "../interfaces/LocationBlockageConsumerReq";

export class LocationBlockageCreatedConsumer extends CoreConsumer<LocationBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCreated;
  queue = "blockageCreatedQueue";

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

          const createdItem = await locationBlockageController.datamapper.insert(data);

          if (createdItem) {
            console.log("Location blockage creation successful.")
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