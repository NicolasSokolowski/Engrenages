import { CoreConsumer, RedisManager, RoutingKeys } from "@zencorp/engrenages";
import { LocationBlockageConsumerReq } from "../interfaces/location/LocationBlockageConsumerReq";
import { Channel, ConsumeMessage } from "amqplib";
import { locationBlockageController, locationController } from "../../app/controllers/index.controllers";

export class LocationBlockageDeletedConsumer extends CoreConsumer<LocationBlockageConsumerReq> {
  readonly routingKey = RoutingKeys.LocationBlockageDeleted;
  queue = "blockageDeleteQueue";

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

          const checkIfUsed = await locationController.datamapper.checkIfUsed("location_blockage_name", data.name);

          if (!process.env.REDIS_HOST) {
            throw new Error("Redis host must be set")
          }

          const redis = RedisManager.getCmdInstance(process.env.REDIS_HOST, 6379);
          await redis.connect();

          if (checkIfUsed.length === 0) {
            const deletedItem = await locationBlockageController.datamapper.delete(data.id);

            if (deletedItem) {
              console.log("Location blockage deleted successfully");
              await redis.addResponse({ eventID: data.eventID, success: true });
            } else {
              console.log("Location blockage deletion failed.");
              await redis.addResponse({ eventID: data.eventID, success: false });
            }
          } else {
            console.log("Location blockage deletion failed.");
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