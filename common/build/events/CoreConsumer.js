"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreConsumer = void 0;
class CoreConsumer {
    constructor(channel, exchange) {
        this.channel = channel;
        this.exchange = exchange;
        this.setupExchange();
    }
    setupExchange() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.assertExchange(this.exchange, "direct", { durable: true });
        });
    }
    setupQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = yield this.channel.assertQueue(this.queue);
            yield this.channel.bindQueue(queue.queue, this.exchange, this.routingKey);
            return queue.queue;
        });
    }
}
exports.CoreConsumer = CoreConsumer;
