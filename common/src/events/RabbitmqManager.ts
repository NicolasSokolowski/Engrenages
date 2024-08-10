import amqp, { Connection } from "amqplib";

export class RabbitmqManager {
  private static instance: RabbitmqManager;
  private connection: Connection | null = null;

  constructor(private uri: string) {}

  static getInstance(uri: string): RabbitmqManager {
    if (!RabbitmqManager.instance) {
      RabbitmqManager.instance = new RabbitmqManager(uri);
    }
    return RabbitmqManager.instance;
  }

  async connect(): Promise<void> {
    if (this.connection) {
      return;
    }
    try {
      this.connection = await amqp.connect(this.uri);
    } catch (err) {
      console.error("Failed to connect to RabbitMQ", err);
      this.connection = null;
      throw err;
    }
  }

  async createChannel(): Promise<amqp.Channel> {
    if (this.connection === null) {
      throw new Error("Connect to RabbitMQ first before creating a channel");
    }
    return await this.connection.createChannel();
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log("Connection to RabbitMQ closed.");
    } else {
      throw new Error("No RabbitMQ connection is open.")
    }
  }
}
