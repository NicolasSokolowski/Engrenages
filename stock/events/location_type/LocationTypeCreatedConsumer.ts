import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { LocationTypeConsumerReq } from "../interfaces/location/LocationTypeConsumerReq";
import { Channel, ConsumeMessage } from "amqplib";
import { locationTypeController } from "../../app/controllers/index.controllers";

export class LocationTypeCreatedConsumer extends CoreConsumer<LocationTypeConsumerReq> {
  readonly routingKey = RoutingKeys.LocationTypeCreated;
  queue = "typeCreateQueue";

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

          const checkIfItemExists = await locationTypeController.datamapper.findBySpecificField("name", data.name);

          if (!process.env.REDIS_HOST) {
            throw new Error("Redis host must be set")
          }

          const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
          await redis.connect();

          if (!checkIfItemExists) {
            const createdItem = await locationTypeController.datamapper.insert(data);
            if (createdItem) {
              console.log("Location type created successfully");
              await redis.addResponse({ eventID: data.eventID, success: true });
            } else {
              console.log("Location type creation failed.");
              await redis.addResponse({ eventID: data.eventID, success: false });
            }
          } else {
            console.log("Location type creation failed.");
            await redis.addResponse({ eventID: data.eventID, success: false });
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