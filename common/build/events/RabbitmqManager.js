"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqManager = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitmqManager {
    constructor(uri) {
        this.uri = uri;
        this.connection = null;
        this.pubChannel = null;
        this.subChannel = null;
        this.isReconnecting = false;
    }
    static async getInstance(uri) {
        if (!RabbitmqManager.instance) {
            RabbitmqManager.instance = new RabbitmqManager(uri);
            await RabbitmqManager.instance.init();
        }
        return RabbitmqManager.instance;
    }
    async init() {
        await this.connect();
    }
    async connect() {
        try {
            this.connection = await amqplib_1.default.connect(this.uri);
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
        }
        catch (err) {
            console.error("Failed to connect to RabbitMQ", err);
            await this.handleReconnect();
        }
    }
    async handleReconnect() {
        if (this.isReconnecting)
            return;
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
            }
            catch (err) {
                console.error("Reconnection attempt failed:", err);
                await new Promise((resolve) => setTimeout(resolve, reconnectDelay));
            }
        }
        console.error("Max reconnection attempts reached. Could not reconnect to RabbitMQ.");
        this.isReconnecting = false;
    }
    getPubChannel() {
        if (!this.pubChannel) {
            throw new Error("Publish channel is not initialized");
        }
        return this.pubChannel;
    }
    getSubChannel() {
        if (!this.subChannel) {
            throw new Error("Sub channel is not initialized");
        }
        return this.subChannel;
    }
    async close() {
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
        }
        catch (err) {
            console.error("RabbitMQ disconnection error", err);
            throw err;
        }
    }
}
exports.RabbitmqManager = RabbitmqManager;
