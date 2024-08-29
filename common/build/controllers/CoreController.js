"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreController = void 0;
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const NotFoundError_error_1 = require("../errors/NotFoundError.error");
const DatabaseConnectionError_error_1 = require("../errors/DatabaseConnectionError.error");
const RabbitmqManager_1 = require("../events/RabbitmqManager");
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
        this.requestCreation = async (req, res) => {
            let data = req.body;
            const { fields, Publisher, exchangeName } = this.getConfig("create");
            const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));
            if (checkIfExists) {
                throw new BadRequestError_error_1.BadRequestError("Provided input already exists.");
            }
            const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
            const rabbitmqPubChan = rabbitMQ.getPubChannel();
            new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            res.status(202).send({ message: "Traitement de la demande de création en cours..." });
        };
        this.requestUpdate = async (req, res, next) => {
            const id = parseInt(req.params.id, 10);
            let data = req.body;
            const { fields, Publisher, exchangeName } = this.getConfig("update");
            const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));
            if (checkIfExists) {
                throw new BadRequestError_error_1.BadRequestError(`Provided item already exists.`);
            }
            const itemToUpdate = await this.datamapper.findByPk(id);
            if (!itemToUpdate) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
            const rabbitmqPubChan = rabbitMQ.getPubChannel();
            data = {
                ...data,
                version: itemToUpdate.version,
                id
            };
            new Publisher(rabbitmqPubChan, exchangeName).publish(data);
            res.status(202).send({ message: "Traitement de la demande de modification en cours..." });
        };
        this.preDeletionCheck = async (fields, value) => { };
        this.requestDeletion = async (req, res, next) => {
            const id = parseInt(req.params.id, 10);
            const itemToDelete = await this.datamapper.findByPk(id);
            if (!itemToDelete) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            const { fields, Publisher, exchangeName } = this.getConfig("delete");
            await this.preDeletionCheck(fields, itemToDelete);
            const rabbitMQ = await RabbitmqManager_1.RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
            const rabbitmqPubChan = rabbitMQ.getPubChannel();
            new Publisher(rabbitmqPubChan, exchangeName).publish(itemToDelete);
            res.status(202).send({ message: "Traitement de la demande de suppression en cours..." });
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
