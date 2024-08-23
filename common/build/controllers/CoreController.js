"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreController = void 0;
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const NotFoundError_error_1 = require("../errors/NotFoundError.error");
const DatabaseConnectionError_error_1 = require("../errors/DatabaseConnectionError.error");
const redisConnection_1 = require("../helpers/redisConnection");
const RabbitmqManager_1 = require("../events/RabbitmqManager");
const makeRandomString_helper_1 = require("../helpers/makeRandomString.helper");
class CoreController {
    constructor(datamapper, configs) {
        this.datamapper = datamapper;
        this.getByPk = async (req, res) => {
            const id = parseInt(req.params.id);
            if (!id) {
                throw new BadRequestError_error_1.BadRequestError("You should provide an id");
            }
            const searchedItem = await this.datamapper.findByPk(id);
            if (!searchedItem) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            res.status(200).send(searchedItem);
        };
        this.getAll = async (req, res) => {
            const itemsList = await this.datamapper.findAll();
            if (!itemsList) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            res.status(200).send(itemsList);
        };
        this.getBySpecificField = async (field, value) => {
            const item = await this.datamapper.findBySpecificField(field, value);
            return item;
        };
        this.create = async (req, res) => {
            const item = req.body;
            const createdItem = await this.datamapper.insert(item);
            res.status(201).json(createdItem);
        };
        this.delete = async (req, res) => {
            const id = parseInt(req.params.id);
            if (!id) {
                throw new BadRequestError_error_1.BadRequestError("This id doesn't exist");
            }
            const itemToDelete = await this.datamapper.findByPk(id);
            if (!itemToDelete) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            const deletedItem = await this.datamapper.delete(id);
            if (!deletedItem) {
                throw new DatabaseConnectionError_error_1.DatabaseConnectionError();
            }
            res.status(200).send(deletedItem);
        };
        this.requestCreation = async (req, res, next) => {
            let data = req.body;
            const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("create");
            const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));
            if (!process.env.REDIS_HOST) {
                throw new BadRequestError_error_1.BadRequestError("Redis host must be set");
            }
            const { redis, redisSub } = await (0, redisConnection_1.redisConnection)();
            const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
            const rabbitmqPubChan = rabbitMQ.getPubChannel();
            if (!checkIfExists) {
                let eventID = (0, makeRandomString_helper_1.makeRandomString)(10);
                await redis.createTransaction({ eventID, expectedResponses });
                data = { ...data, eventID };
                new Publisher(rabbitmqPubChan, exchangeName).publish(data);
                await redisSub.subscribe(eventID, async (isSuccessful) => {
                    try {
                        if (isSuccessful) {
                            const createdItem = await this.datamapper.insert(data);
                            console.log("Creation successful.");
                            res.status(201).send(createdItem);
                        }
                        else {
                            throw new BadRequestError_error_1.BadRequestError("A service failed during creation.");
                        }
                    }
                    catch (err) {
                        next(err);
                    }
                });
            }
            else {
                throw new BadRequestError_error_1.BadRequestError("Item already exists.");
            }
        };
        this.requestUpdate = async (req, res, next) => {
            const id = parseInt(req.params.id, 10);
            let data = req.body;
            const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("update");
            const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));
            if (checkIfExists) {
                throw new BadRequestError_error_1.BadRequestError(`Provided item already exists.`);
            }
            if (!process.env.REDIS_HOST) {
                throw new BadRequestError_error_1.BadRequestError("Redis host must be set");
            }
            const itemToUpdate = await this.datamapper.findByPk(id);
            if (!process.env.REDIS_HOST) {
                throw new Error("Redis host must be set");
            }
            if (itemToUpdate) {
                const { redis, redisSub } = await (0, redisConnection_1.redisConnection)();
                const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
                const rabbitmqPubChan = rabbitMQ.getPubChannel();
                let eventID = (0, makeRandomString_helper_1.makeRandomString)(10);
                await redis.createTransaction({ eventID, expectedResponses });
                data = {
                    ...data,
                    version: itemToUpdate.version,
                    eventID,
                    id
                };
                new Publisher(rabbitmqPubChan, exchangeName).publish(data);
                await redisSub.subscribe(eventID, async (isSuccessful) => {
                    try {
                        if (isSuccessful) {
                            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
                            console.log("Update successful.");
                            res.status(200).send(updatedItem);
                        }
                        else {
                            throw new BadRequestError_error_1.BadRequestError("A service failed during update.");
                        }
                    }
                    catch (err) {
                        next(err);
                    }
                });
            }
            else {
                throw new NotFoundError_error_1.NotFoundError();
            }
        };
        this.preDeletionCheck = async (fields, value) => { };
        this.requestDeletion = async (req, res, next) => {
            const id = parseInt(req.params.id, 10);
            const itemToDelete = await this.datamapper.findByPk(id);
            const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("delete");
            await this.preDeletionCheck(fields, itemToDelete);
            if (!process.env.REDIS_HOST) {
                throw new Error("Redis host must be set");
            }
            if (itemToDelete) {
                const { redis, redisSub } = await (0, redisConnection_1.redisConnection)();
                const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
                const rabbitmqPubChan = rabbitMQ.getPubChannel();
                let eventID = (0, makeRandomString_helper_1.makeRandomString)(10);
                await redis.createTransaction({ eventID, expectedResponses });
                const data = {
                    ...itemToDelete,
                    eventID
                };
                new Publisher(rabbitmqPubChan, exchangeName).publish(data);
                await redisSub.subscribe(eventID, async (isSuccessful) => {
                    try {
                        if (isSuccessful) {
                            const deletedItem = await this.datamapper.delete(id);
                            console.log("Deletion successful");
                            res.status(200).send(deletedItem);
                        }
                        else {
                            throw new BadRequestError_error_1.BadRequestError("A service failed during deletion.");
                        }
                    }
                    catch (err) {
                        next(err);
                    }
                });
            }
            else {
                throw new NotFoundError_error_1.NotFoundError();
            }
        };
        this.configs = configs;
    }
    getConfig(method) {
        if (!this.configs[method]) {
            throw new BadRequestError_error_1.BadRequestError(`Configuration for method ${method} not set.`);
        }
        return this.configs[method];
    }
}
exports.CoreController = CoreController;
