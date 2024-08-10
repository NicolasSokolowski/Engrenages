import { Channel } from "amqplib";
import { RoutingKeys } from "./RoutingKeys";

export interface PublisherReq {
  exchangeName: string;
  routingKey: RoutingKeys;
  data: any;
}

export abstract class CorePublisher<T extends PublisherReq> {
  abstract routingKey: T["routingKey"];
  private exchange: T["exchangeName"];

  constructor (private channel: Channel, exchange: T["exchangeName"]) {
    this.exchange = exchange;
    this.setupExchange();
  }

  private async setupExchange(): Promise<void> {
    await this.channel.assertExchange(this.exchange, "direct", { durable: true });
  }

  async publish(data: T["data"]): Promise<void> {
    const options = { persistent: true };
    this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), options);
    console.log(`Published message to ${this.exchange} using routing key: ${this.routingKey}`);
  }
}