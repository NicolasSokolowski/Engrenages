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
exports.CorePublisher = void 0;
class CorePublisher {
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
    publish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { persistent: true };
            this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), options);
            console.log(`Published message to ${this.exchange} using routing key: ${this.routingKey}`);
        });
    }
}
exports.CorePublisher = CorePublisher;
