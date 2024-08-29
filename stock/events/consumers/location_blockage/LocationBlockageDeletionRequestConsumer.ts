import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationBlockageConsumerReq } from "../../index.events";
import { locationBlockageController, locationController } from "../../../app/controllers/index.controllers";

export class LocationBlockageDeletionRequestConsumer extends CoreConsumer<LocationBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.LocationBlockageDeletionRequest;
  queue = "blockageDeleteQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationBlockageController.getConfig("delete");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfUsed = await locationController.datamapper.checkIfUsed("location_blockage_name", data.name);

          if (checkIfUsed.length === 0) {
            const deletedItem = await locationBlockageController.datamapper.delete(data.id);

            if (deletedItem) {
              console.log("Location blockage deleted successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
              
            } else {
              console.log("Location blockage deletion failed.");
            }
          } else {
            console.log("Location blockage deletion failed.");
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