import { CoreConsumer, RabbitmqManager, RoutingKeys } from "@zencorp/engrenages";
import { Channel, ConsumeMessage } from "amqplib";
import { LocationTypeConsumerReq } from "../../index.events";
import { locationTypeController } from "../../../app/controllers/index.controllers";

export class LocationTypeCreationRequestConsumer extends CoreConsumer<LocationTypeConsumerReq> {
  readonly routingKey = RoutingKeys.LocationTypeCreationRequest;
  queue = "typeCreateQueue";

  constructor(channel: Channel, exchange: string) {
    super(channel, exchange);
  }

  async consume(): Promise<void> {
    const queue = await this.setupQueue();

    const { Publisher, exchangeName } = locationTypeController.getConfig("create");

    this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log(`Received message from ${this.exchange} using routing key: ${this.routingKey}`);

          const checkIfItemExists = await locationTypeController.datamapper.findBySpecificField("name", data.name);


          if (!checkIfItemExists) {
            const createdItem = await locationTypeController.datamapper.insert(data);
            if (createdItem) {
              console.log("Location type created successfully");

              const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
              const rabbitmqPubChan = rabbitMQ.getPubChannel();

              new Publisher(rabbitmqPubChan, exchangeName).publish(data);
              
            } else {
              console.log("Location type creation failed.");
            }
          } else {
            console.log("Location type creation failed.");
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