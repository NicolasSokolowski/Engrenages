import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationBlockageConsumerReq } from "../../index.events";
import { locationBlockageController } from "../../../app/controllers/index.controllers";

export class LocationBlockageCreationRequestConsumer extends CoreConsumer<LocationBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.LocationBlockageCreationRequest;
  queue = "blockageCreateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationBlockageController.getConfig("create");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfItemExists = await locationBlockageController.datamapper.findBySpecificField("name", data.name);

          if (!checkIfItemExists) {
            const createdItem = await locationBlockageController.datamapper.insert(data);

            if (createdItem) {
              console.log("Location blockage creation successful.")

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);

            } else {
              console.log("Location blockage creation failed.")
            }
          } else {
            console.log("Location blockage creation failed.");
            // Publication d'un event fail pour le client
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