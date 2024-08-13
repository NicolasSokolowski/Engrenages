import amqp, { Channel, Connection } from "amqplib";

export class RabbitmqManager {
  private static instance: RabbitmqManager;
  private connection: Connection | null = null;
  private pubChannel: Channel | null = null;
  private subChannel: Channel | null = null;
  private isReconnecting: boolean = false;

  constructor(private uri: string) {}

  static async getInstance(uri: string): Promise<RabbitmqManager> {
    if (!RabbitmqManager.instance) {
      RabbitmqManager.instance = new RabbitmqManager(uri);
      await RabbitmqManager.instance.init();
    }
    return RabbitmqManager.instance;
  }

  private async init(): Promise<void> {
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.uri);

      this.pubChannel = await this.connection.createChannel();
      this.subChannel = await this.connection.createChannel();

      this.connection.on("close", async () => {
        console.error("RabbitMQ connection closed. Reconnecting...");
        await this.handleReconnect();
      });

      this.connection.on("error", async (err) => {
        console.error("RabbitMQ connection error:", err);
        if (this.connection) {
          await this.connection.close();
        }
        await this.handleReconnect();
      });
    } catch (err) {
      console.error("Failed to connect to RabbitMQ", err);
      await this.handleReconnect();
    }
  }

  private async handleReconnect(): Promise<void> {
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    const reconnectDelay = 5000;
    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      console.log(`Reconnection attempt ${attempt}/${maxRetries}...`);
      try {
        await this.connect();
        console.log("Reconnected to RabbitMQ successfully.");
        this.isReconnecting = false;
      } catch (err) {
        console.error("Reconnection attempt failed:", err);
        await new Promise((resolve) => setTimeout(resolve, reconnectDelay));
      }
    }

    console.error("Max reconnection attempts reached. Could not reconnect to RabbitMQ.");
    this.isReconnecting = false;
  }

  public getPubChannel(): Channel {
    if (!this.pubChannel) {
      throw new Error("Publish channel is not initialized")
    }
    return this.pubChannel;
  }

  public getSubChannel(): Channel {
    if (!this.subChannel) {
      throw new Error("Sub channel is not initialized")
    }
    return this.subChannel;
  }

  async close(): Promise<void> {
    try {
      if (this.pubChannel) {
        await this.pubChannel.close();
        this.pubChannel = null;
      }

      if (this.subChannel) {
        await this.subChannel.close();
        this.subChannel = null;
      }

      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
    } catch (err) {
      console.error("RabbitMQ disconnection error", err);
      throw err;
    }
  }
}
