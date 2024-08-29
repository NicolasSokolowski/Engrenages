import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationConsumerReq } from "../../index.events";
import { locationController } from "../../../app/controllers/index.controllers";

export class LocationUpdateRequestConsumer extends CoreConsumer<LocationConsumerReq> {
  readonly routingKey = RoutingKeys.LocationUpdateRequest;
  queue = "locationUpdateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationController.getConfig("update");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfExists = await locationController.datamapper.findByPk(data.id);
          const checkIfLocationExists = await locationController.datamapper.findBySpecificField("location", data.newLocation);

          if (checkIfExists && !checkIfLocationExists) {
            const updatedItem = await locationController.datamapper.update(data, data.version);

            if (updatedItem) {
              console.log("Location updated successfully");
              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);

            } else {
              console.log("Location update failed.");

            }
          } else {
            console.log("Location update failed.");

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