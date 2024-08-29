import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationBlockageConsumerReq } from "../../index.events";
import { locationBlockageController } from "../../../app/controllers/index.controllers";

export class LocationBlockageUpdateRequestConsumer extends CoreConsumer<LocationBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.LocationBlockageUpdateRequest;
  queue = "blockageUpdateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationBlockageController.getConfig("update");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfExists = await locationBlockageController.datamapper.findByPk(data.id);
          const checkIfNameIsUsed = await locationBlockageController.datamapper.findBySpecificField("name", data.name);

          if (checkIfExists && !checkIfNameIsUsed) {
            const updatedItem = await locationBlockageController.datamapper.update(data, data.version);

            if (updatedItem) {
              console.log("Location blockage updated successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            } else {
              console.log("Location blockage update failed.");
            }
          } else {
            console.log("Location blockage update failed.");
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