import { Channel } from "amqplib";
import { ConsumerReq } from "./ConsumerReq";

export abstract class CoreConsumer<T extends ConsumerReq> {
  protected exchange: T["exchangeName"];
  abstract routingKey: T["routingKey"];
  abstract queue: T["queueName"];
  abstract consume(): Promise<void>;

  constructor(public channel: Channel, exchange: string) {
    this.exchange = exchange;
    this.setupExchange();
  }

  protected async setupExchange(): Promise<void> {
    await this.channel.assertExchange(this.exchange, "direct", { durable: true });
  }

  protected async setupQueue() {
    const queue = await this.channel.assertQueue(this.queue);
    await this.channel.bindQueue(queue.queue, this.exchange, this.routingKey);
    return queue.queue;
  }
}