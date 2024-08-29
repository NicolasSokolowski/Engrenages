import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { locationController } from "../../../app/controllers/index.controllers";
import { LocationConsumerReq } from "../../index.events";

export class LocationCreationRequestConsumer extends CoreConsumer<LocationConsumerReq> {
  readonly routingKey = RoutingKeys.LocationCreationRequest;
  queue = "locationCreateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationController.getConfig("create");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfItemExists = await locationController.datamapper.findBySpecificField("location", data.newLocation);

          if (!checkIfItemExists) {
            const createdItem = await locationController.datamapper.insert(data);
            if (createdItem) {
              console.log("Location created successfully");
              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);

            } else {
              console.log("Location creation failed.");
            }
          } else {
            console.log("Location creation failed.");
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