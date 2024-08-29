import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { EntityControllerRequirements } from "./EntityControllerRequirements";
import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
import { RabbitmqManager } from "../events/RabbitmqManager";

export interface CoreConfig {
  fields: string[];
  Publisher: any;
  exchangeName: string;
}

export abstract class CoreController<T extends EntityControllerRequirements, Y extends EntityDatamapperRequirements> {
  protected configs: { [key: string]: CoreConfig};

  constructor(public datamapper: T["datamapper"], configs: { [key: string]: CoreConfig}) {
    this.configs = configs;
  }

  getConfig(method: string): CoreConfig {
    if (!this.configs[method]) {
      throw new BadRequestError(`Configuration for method ${method} not set.`)
    }
    return this.configs[method];
  }

  getByPk = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("You should provide an id")
    }

    const searchedItem = await this.datamapper.findByPk(id);

    if (!searchedItem) {
      throw new NotFoundError();
    }

    res.status(200).send(searchedItem);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const itemsList = await this.datamapper.findAll();

    if (!itemsList) {
      throw new NotFoundError();
    }

    res.status(200).send(itemsList);
  }

  getBySpecificField = async (field: string, value:string) => {
    const item = await this.datamapper.findBySpecificField(field, value);
    return item;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const item: Y["data"] = req.body;

    const createdItem = await this.datamapper.insert(item);

    res.status(201).json(createdItem);
  }

  delete = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist")
    }

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    const deletedItem = await this.datamapper.delete(id);

    if (!deletedItem) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(deletedItem);
  }

  requestCreation = async (req: Request, res: Response) => {
    let data = req.body;

    const { fields, Publisher, exchangeName } = this.getConfig("create");

    const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));

    if (checkIfExists) {
      throw new BadRequestError("Provided input already exists.")
    }

    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();

    new Publisher(rabbitmqPubChan, exchangeName).publish(data);

    res.status(202).send({ message: "Traitement de la demande de création en cours..."});
  }

  requestUpdate = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    const { fields, Publisher, exchangeName } = this.getConfig("update");

    const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));

    if (checkIfExists) {
      throw new BadRequestError(`Provided item already exists.`);
    }
    
    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }

    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();

    data = {
      ...data,
      version: itemToUpdate.version,
      id
    }

    new Publisher(rabbitmqPubChan, exchangeName).publish(data);

    res.status(202).send({ message: "Traitement de la demande de modification en cours..."});
  }

  preDeletionCheck = async (fields: string[], value: any): Promise<void> => {};

  requestDeletion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    const { fields, Publisher, exchangeName } = this.getConfig("delete");

    await this.preDeletionCheck(fields, itemToDelete);

    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();

    new Publisher(rabbitmqPubChan, exchangeName).publish(itemToDelete);

    res.status(202).send({ message: "Traitement de la demande de suppression en cours..."});
  }
}