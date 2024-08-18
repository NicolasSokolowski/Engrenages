import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { ProductControllerRequirements } from "../interfaces/ProductControllerRequirements";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";
import { ProductCreatedPublisher, ProductDeletedPublisher, ProductUpdatedPublisher } from "../../../events/index.events";


export class ProductController extends CoreController<ProductControllerRequirements, ProductDatamapperRequirements> {
  constructor(datamapper: ProductControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let data = req.body;

    const checkIfEanExists = await this.datamapper.findBySpecificField("ean", data.ean);
    const checkIfTitleExists = await this.datamapper.findBySpecificField("title", data.title);
    
    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    if (!checkIfEanExists && !checkIfTitleExists) {
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses: 1 });
  
      data = {
        ...data,
        eventID
      }
      
      new ProductCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const createdItem = await this.datamapper.insert(data);
            console.log("Product created successfully");
            res.send(createdItem);
          } else {
            throw new BadRequestError("A service failed at product creation");
          }
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError(`Product title or EAN ${data.ean} already exists.`)
    }
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.ean) {
      const checkIfEanExists = await this.datamapper.findBySpecificField("ean", data.ean);

      if (checkIfEanExists) {
        throw new BadRequestError(`Product EAN ${data.ean} already exists.`)
      }
    }

    if (data.title) {
      const checkIfTitleExists = await this.datamapper.findBySpecificField("title", data.title);

      if (checkIfTitleExists) {
        throw new BadRequestError(`Product title "${data.title}" already exists.`)
      }
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
      await redis.createTransaction({ eventID, expectedResponses: 1 });
  
      data = {
        ...data,
        version: itemToUpdate.version,
        eventID,
        id
      }
  
      new ProductUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
            console.log("Location type updated successfully");
            res.status(200).send(updatedItem);
          } else {
            throw new BadRequestError("A service failed location type update");
          }          
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new NotFoundError();
    }
  }

  requestDeletion = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }

    if (itemToDelete) {
      const { redis, redisSub } = await redisConnection();
      const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
      const rabbitmqPubChan = rabbitMQ.getPubChannel();
      
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses: 1 });
  
      const data = {
        ...itemToDelete,
        eventID
      }

      new ProductDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Product deleted successfully");
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