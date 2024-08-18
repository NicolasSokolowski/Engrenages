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
exports.RedisManager = void 0;
const ioredis_1 = require("ioredis");
;
;
class RedisManager {
    constructor(host, port = 6379) {
        this.host = host;
        this.port = port;
        this.redis = null;
    }
    static getSubInstance(host, port) {
        if (!RedisManager.subInstance) {
            RedisManager.subInstance = new RedisManager(host, port);
        }
        return RedisManager.subInstance;
    }
    static getCmdInstance(host, port) {
        if (!RedisManager.cmdInstance) {
            RedisManager.cmdInstance = new RedisManager(host, port);
        }
        return RedisManager.cmdInstance;
    }
    ensureConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.redis) {
                try {
                    yield this.connect();
                }
                catch (err) {
                    console.error("Failed to reconnect to Redis", err);
                    throw new Error("Redis connection could not be re-etablished");
                }
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.redis) {
                return;
            }
            try {
                this.redis = new ioredis_1.Redis({
                    host: this.host,
                    port: this.port
                });
            }
            catch (err) {
                console.error("Failed to connect to Redis:", err);
                this.redis = null;
                throw err;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.redis) {
                yield this.redis.quit();
                this.redis = null;
                console.log("Connection to Redis closed");
            }
            else {
                throw new Error("No Redis connection is open");
            }
        });
    }
    createTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ eventID, expectedResponses }) {
            yield this.ensureConnected();
            const transactionKey = `transaction:${eventID}`;
            yield this.redis.hmset(transactionKey, {
                'expectedResponses': expectedResponses,
                'receivedResponses': 0,
                'successfulResponses': 0
            });
            yield this.redis.expire(transactionKey, 30);
            console.log(`Transaction ${eventID} initialized with ${expectedResponses} expected responses.`);
        });
    }
    ;
    addResponse(_a) {
        return __awaiter(this, arguments, void 0, function* ({ eventID, success }) {
            yield this.ensureConnected();
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
                const result = yield this.redis.eval(luaScript, 2, transactionKey, channel, successInt);
                console.log(`Lua script executed, result: ${result}`);
            }
            catch (err) {
                console.error("Error executing Lua script", err);
            }
        });
    }
    subscribe(eventID, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnected();
            const subscribedChannel = `channel:${eventID}`;
            this.messageHandler = (channel, message) => {
                if (channel === subscribedChannel) {
                    try {
                        console.log(`Notification received on ${subscribedChannel}: ${message}`);
                        const isSuccess = message === 'success';
                        callback(isSuccess);
                    }
                    finally {
                        this.cleanup(subscribedChannel).catch(error => console.error('Cleanup failed:', error));
                    }
                }
            };
            yield this.redis.subscribe(subscribedChannel);
            console.log("Waiting for notification...");
            this.redis.on("message", this.messageHandler);
        });
    }
    cleanup(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureConnected();
            if (this.messageHandler) {
                yield this.redis.unsubscribe(channel);
                this.redis.removeListener("message", this.messageHandler);
                this.messageHandler = undefined;
            }
        });
    }
}
exports.RedisManager = RedisManager;
;
