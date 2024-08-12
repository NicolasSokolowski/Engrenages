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
    }
    static getInstance(uri) {
        if (!RabbitmqManager.instance) {
            RabbitmqManager.instance = new RabbitmqManager(uri);
        }
        return RabbitmqManager.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                return;
            }
            try {
                this.connection = yield amqplib_1.default.connect(this.uri);
            }
            catch (err) {
                console.error("Failed to connect to RabbitMQ", err);
                this.connection = null;
                throw err;
            }
        });
    }
    createChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection === null) {
                throw new Error("Connect to RabbitMQ first before creating a channel");
            }
            return yield this.connection.createChannel();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                yield this.connection.close();
                this.connection = null;
                console.log("Connection to RabbitMQ closed.");
            }
            else {
                throw new Error("No RabbitMQ connection is open.");
            }
        });
    }
}
exports.RabbitmqManager = RabbitmqManager;
