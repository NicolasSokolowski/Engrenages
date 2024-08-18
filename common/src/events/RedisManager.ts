import { Redis } from "ioredis";

interface TransactionData {
  eventID: string;
  expectedResponses: number;
};

interface ResponseUpdate {
  eventID: string;
  success: boolean;
};

export class RedisManager {
  private static subInstance: RedisManager;
  private static cmdInstance: RedisManager;
  private redis: Redis | null = null;
  private messageHandler?: (channel: string, message: string) => void; 

  constructor(private host: string, private port: number = 6379) {}

  static getSubInstance(host: string, port: number): RedisManager {
    if (!RedisManager.subInstance) {
      RedisManager.subInstance = new RedisManager(host, port);
    }
    return RedisManager.subInstance;
  }

  static getCmdInstance(host: string, port: number): RedisManager {
    if (!RedisManager.cmdInstance) {
      RedisManager.cmdInstance = new RedisManager(host, port);
    }
    return RedisManager.cmdInstance;
  }

  private async ensureConnected(): Promise<void> {
    if (!this.redis) {
      try {
        await this.connect();
      } catch (err) {
        console.error("Failed to reconnect to Redis", err);
        throw new Error("Redis connection could not be re-etablished")
      }
    }
  }

  async connect(): Promise<void> {
    if (this.redis) {
      return;
    }
    
    try {
      this.redis = new Redis({
        host: this.host,
        port: this.port
      })
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      this.redis = null;
      throw err;
    }
  }

  async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      console.log("Connection to Redis closed");
    } else {
      throw new Error("No Redis connection is open");
    }
  }

  public async createTransaction({ eventID, expectedResponses }: TransactionData): Promise<void> {
    await this.ensureConnected();
    const transactionKey = `transaction:${eventID}`;
    await this.redis!.hmset(transactionKey, {
      'expectedResponses': expectedResponses,
      'receivedResponses': 0,
      'successfulResponses': 0
    });
    await this.redis!.expire(transactionKey, 30);
    console.log(`Transaction ${eventID} initialized with ${expectedResponses} expected responses.`)
  };

  public async addResponse({ eventID, success }: ResponseUpdate): Promise<void> {
    await this.ensureConnected();
    const transactionKey = `transaction:${eventID}`;
    const channel = `channel:${eventID}`;
    const successInt = success ? 1 : 0;

    const luaScript = `
      local transactionKey = KEYS[1]
      local channel = KEYS[2]
      local success = tonumber(ARGV[1])
      
      local received = redis.call('HINCRBY', transactionKey, 'receivedResponses', 1)
      local successful = 0
      if success == 1 then
        successful = redis.call('HINCRBY', transactionKey, 'successfulResponses', 1)
      end
      
      local expected = tonumber(redis.call('HGET', transactionKey, 'expectedResponses'))
      if received >= expected then
        local status = (successful == expected) and 'success' or 'fail'
        redis.call('PUBLISH', channel, status)
      end

      return received
    `;

    try {
      const result = await this.redis!.eval(luaScript, 2, transactionKey, channel, successInt);
      console.log(`Lua script executed, result: ${result}`);
    } catch (err) {
      console.error("Error executing Lua script", err);
    }
  }

  public async subscribe(eventID: string, callback: (success: boolean) => void): Promise<void> {
    await this.ensureConnected();
    const subscribedChannel = `channel:${eventID}`;

    this.messageHandler = (channel: string, message: string) => {
      if (channel === subscribedChannel) {
        try {
          console.log(`Notification received on ${subscribedChannel}: ${message}`);
          const isSuccess = message === 'success';
          callback(isSuccess);
        } finally {
          this.cleanup(subscribedChannel).catch(error => console.error('Cleanup failed:', error));
        }
      }
    }

    await this.redis!.subscribe(subscribedChannel);
    console.log("Waiting for notification...");
    this.redis!.on("message", this.messageHandler);
  }

  private async cleanup(channel: string): Promise<void> {
    await this.ensureConnected();
    if (this.messageHandler) {
      await this.redis!.unsubscribe(channel);
      this.redis!.removeListener("message", this.messageHandler);
      this.messageHandler = undefined;
    }
  }
};
