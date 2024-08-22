"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreConsumer = void 0;
class CoreConsumer {
    constructor(channel, exchange) {
        this.channel = channel;
        this.exchange = exchange;
        this.setupExchange();
    }
    async setupExchange() {
        await this.channel.assertExchange(this.exchange, "direct", { durable: true });
    }
    async setupQueue() {
        const queue = await this.channel.assertQueue(this.queue);
        await this.channel.bindQueue(queue.queue, this.exchange, this.routingKey);
        return queue.queue;
    }
}
exports.CoreConsumer = CoreConsumer;
