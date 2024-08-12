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
exports.rabbitmqConnection = void 0;
const RabbitmqManager_1 = require("../events/RabbitmqManager");
const rabbitmqConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const rabbitMQ = RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    yield rabbitMQ.connect();
    const channel = yield rabbitMQ.createChannel();
    return channel;
});
exports.rabbitmqConnection = rabbitmqConnection;
