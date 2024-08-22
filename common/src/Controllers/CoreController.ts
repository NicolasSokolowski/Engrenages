import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { EntityControllerRequirements } from "./EntityControllerRequirements";
import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
import { redisConnection } from "../helpers/redisConnection";
import { RabbitmqManager } from "../events/RabbitmqManager";
import { makeRandomString } from "../helpers/makeRandomString.helper";

export interface CoreConfig {
  fields: string[];
  Publisher: any;
  exchangeName: string;
  expectedResponses: number;
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

  requestCreation = async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("create");

    const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));

    if (!process.env.REDIS_HOST) {
      throw new BadRequestError("Redis host must be set");
    }

    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();

    if (!checkIfExists) {
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses });

      data = { ...data, eventID };

      new Publisher(rabbitmqPubChan, exchangeName).publish(data);

      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const createdItem = await this.datamapper.insert(data);
            console.log("Creation successful.");
            res.status(201).send(createdItem);
          } else {
            throw new BadRequestError("A service failed during creation.")
          }
        } catch (err) {
          next(err)
        }
      });
    } else {
      throw new BadRequestError("Item already exists.")
    }
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("update");

    const checkIfExists = await Promise.any(fields.map((field) => this.datamapper.findBySpecificField(field, data[field])));

    if (checkIfExists) {
      throw new BadRequestError(`Provided item already exists.`);
    }

    if (!process.env.REDIS_HOST) {
      throw new BadRequestError("Redis host must be set");
    }
    
    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    if (itemToUpdate) {
      const { redis, redisSub } = await redisConnection();
      const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
      const rabbitmqPubChan = rabbitMQ.getPubChannel();
      
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses });
  
      data = {
        ...data,
        version: itemToUpdate.version,
        eventID,
        id
      }
  
      new Publisher(rabbitmqPubChan, exchangeName).publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
            console.log("Update successful.");
            res.status(200).send(updatedItem);
          } else {
            throw new BadRequestError("A service failed during update.");
          }          
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new NotFoundError();
    }
  }

  preDeletionCheck = async (fields: string[], value: any): Promise<void> => {};

  requestDeletion = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    const itemToDelete = await this.datamapper.findByPk(id);

    const { fields, Publisher, expectedResponses, exchangeName } = this.getConfig("delete");

    await this.preDeletionCheck(fields, itemToDelete);

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }

    if (itemToDelete) {
      const { redis, redisSub } = await redisConnection();
      const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
      const rabbitmqPubChan = rabbitMQ.getPubChannel();
      
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses });
  
      const data = {
        ...itemToDelete,
        eventID
      }

      new Publisher(rabbitmqPubChan, exchangeName).publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Deletion successful");
            res.status(200).send(deletedItem);
          } else {
            throw new BadRequestError("A service failed at product deletion.");
          }        
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new NotFoundError();
    }
  }
}