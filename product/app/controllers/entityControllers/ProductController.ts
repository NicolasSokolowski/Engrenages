import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCheckPublisher, ProductCreatedPublisher, ProductDeletedPublisher, ProductUpdatedPublisher } from "../../../events/index.events";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response): Promise<void> => {
    let data = req.body;

    if (data.ean) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("ean", data.ean);

      if (checkIfItemExists) {
        throw new BadRequestError(`Product ${data.ean} already exists.`)
      }
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    let eventID = makeRandomString(10);
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID
    }
    
    new ProductCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to product blockage type creation");
        const createdItem = await this.datamapper.insert(data);
        eventID = makeRandomString(10);

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...data,
          eventID
        }

        new ProductCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product created successfully");
            res.send(createdItem);
          } else {
            throw new Error("A service failed product creation");
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

    if (data.ean) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("ean", data.ean);

      if (checkIfItemExists) {
        throw new BadRequestError(`Product ${data.ean} already exists.`)
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
    
    let eventID = makeRandomString(10);
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID,
      id
    }

    new ProductCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to product update");
        let updatedItem = await this.datamapper.update(data, itemToUpdate.version);
        eventID = makeRandomString(10);

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...updatedItem,
          eventID
        }

        new ProductUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product updated successfully");
            res.send(updatedItem);
          } else {
            throw new Error("A service failed product update");
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
    
    let eventID = makeRandomString(10);
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    const data = {
      ...itemToDelete,
      eventID
    }

    new ProductCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (successful) => {
      if (successful) {
        console.log("Data checked successfuly, proceeding to product deletion");
        const deletedItem = await this.datamapper.delete(id);
        eventID = makeRandomString(10);

        const data = {
          ...deletedItem,
          eventID
        }

        await redis.createTransaction({ eventID, expectedResponses: 1 });

        new ProductDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Product deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new Error("A service failed product deletion");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    })
  }
}