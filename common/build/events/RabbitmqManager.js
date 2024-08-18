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
        this.pubChannel = null;
        this.subChannel = null;
        this.isReconnecting = false;
    }
    static getInstance(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitmqManager.instance) {
                RabbitmqManager.instance = new RabbitmqManager(uri);
                yield RabbitmqManager.instance.init();
            }
            return RabbitmqManager.instance;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(this.uri);
                this.pubChannel = yield this.connection.createChannel();
                this.subChannel = yield this.connection.createChannel();
                this.connection.on("close", () => __awaiter(this, void 0, void 0, function* () {
                    console.error("RabbitMQ connection closed. Reconnecting...");
                    yield this.handleReconnect();
                }));
                this.connection.on("error", (err) => __awaiter(this, void 0, void 0, function* () {
                    console.error("RabbitMQ connection error:", err);
                    if (this.connection) {
                        yield this.connection.close();
                    }
                    yield this.handleReconnect();
                }));
            }
            catch (err) {
                console.error("Failed to connect to RabbitMQ", err);
                yield this.handleReconnect();
            }
        });
    }
    handleReconnect() {
        return __awaiter(this, void 0, void 0, function* () {
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
                    yield this.connect();
                    console.log("Reconnected to RabbitMQ successfully.");
                    this.isReconnecting = false;
                }
                catch (err) {
                    console.error("Reconnection attempt failed:", err);
                    yield new Promise((resolve) => setTimeout(resolve, reconnectDelay));
                }
            }
            console.error("Max reconnection attempts reached. Could not reconnect to RabbitMQ.");
            this.isReconnecting = false;
        });
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
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.pubChannel) {
                    yield this.pubChannel.close();
                    this.pubChannel = null;
                }
                if (this.subChannel) {
                    yield this.subChannel.close();
                    this.subChannel = null;
                }
                if (this.connection) {
                    yield this.connection.close();
                    this.connection = null;
                }
            }
            catch (err) {
                console.error("RabbitMQ disconnection error", err);
                throw err;
            }
        });
    }
}
exports.RabbitmqManager = RabbitmqManager;
