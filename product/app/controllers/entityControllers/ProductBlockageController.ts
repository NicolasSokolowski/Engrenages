import { Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { BlockageControllerRequirements } from "../interfaces/BlockageControllerRequirements";
import { BlockageDatamapperRequirements } from "../../datamappers/interfaces/BlockageDatamapperRequirements";
import { ProductBlockageCheckPublisher } from "../../../events/product_blockage/ProductBlockageCheckPublisher";
import { ProductBlockageCreatedPublisher } from "../../../events/product_blockage/ProductBlockageCreatedPublisher";
import { ProductBlockageUpdatedPublisher } from "../../../events/product_blockage/ProductBlockageUpdatedPublisher";
import { ProductBlockageDeletedPublisher } from "../../../events/product_blockage/ProductBlockageDeletedPublisher";

export class ProductBlockageController extends CoreController<BlockageControllerRequirements, BlockageDatamapperRequirements> {
  constructor(datamapper: BlockageControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response): Promise<void> => {
    let data = req.body;

    const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

    if (checkIfItemExists) {
      throw new BadRequestError(`Location blockage ${data.name} already exists.`)
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    let eventID = makeRandomString(10) + `${data.name}`;
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID
    }
    
    new ProductBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to product blockage type creation");
        const createdItem = await this.datamapper.insert(data);
        eventID = makeRandomString(10) + `${data.name}`;

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...data,
          eventID
        }

        new ProductBlockageCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product blockage type created successfully");
            res.send(createdItem);
          } else {
            throw new Error("A service failed product blockage type creation");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    })
  }

  requestUpdate = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfItemExists) {
        throw new BadRequestError(`Location type ${data.name} already exists.`)
      }
    }

    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    let eventID = makeRandomString(10) + data[0];
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID,
      id
    }

    new ProductBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to product blockage type update");
        let updatedItem = await this.datamapper.update(data, itemToUpdate.version);
        eventID = makeRandomString(10) + data[0];

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...updatedItem,
          eventID
        }

        new ProductBlockageUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product blockage type updated successfully");
            res.send(updatedItem);
          } else {
            throw new Error("A service failed product blockage type update");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    });    
  }

  requestDeletion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    let eventID = makeRandomString(10) + `${itemToDelete.name}`;
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    const data = {
      ...itemToDelete,
      eventID
    }

    new ProductBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (successful) => {
      if (successful) {
        console.log("Data checked successfuly, proceeding to location type deletion");
        const deletedItem = await this.datamapper.delete(id);
        eventID = makeRandomString(10) + `${id}`;

        const data = {
          ...deletedItem,
          eventID
        }

        await redis.createTransaction({ eventID, expectedResponses: 1 });

        new ProductBlockageDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product blockage type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new Error("A service failed product blockage type deletion");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    })
  }
};