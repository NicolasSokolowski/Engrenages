"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorePublisher = void 0;
class CorePublisher {
    constructor(channel, exchange) {
        this.channel = channel;
        this.exchange = exchange;
        this.setupExchange();
    }
    async setupExchange() {
        await this.channel.assertExchange(this.exchange, "direct", { durable: true });
    }
    async publish(data) {
        const options = { persistent: true };
        this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), options);
        console.log(`Published message to ${this.exchange} using routing key: ${this.routingKey}`);
    }
}
exports.CorePublisher = CorePublisher;
