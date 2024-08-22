import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { BlockageControllerRequirements } from "../interfaces/BlockageControllerRequirements";
import { BlockageDatamapperRequirements } from "../../datamappers/interfaces/BlockageDatamapperRequirements";
import { ProductBlockageCreatedPublisher, ProductBlockageDeletedPublisher, ProductBlockageUpdatedPublisher } from "../../../events/index.events";
import { productController } from "../index.controllers";


export class ProductBlockageController extends CoreController<BlockageControllerRequirements, BlockageDatamapperRequirements> {

  constructor(datamapper: BlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: ProductBlockageCreatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);

    this.datamapper = datamapper;
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfItemExists) {
        throw new BadRequestError(`Product blockage ${data.name} already exists.`)
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
  
      new ProductBlockageUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
            console.log("Product blockage updated successfully");
            res.status(200).send(updatedItem);
          } else {
            throw new BadRequestError("A service failed product blockage update");
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

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    const checkIfUsed = await productController.datamapper.checkIfUsed("product_blockage_name", itemToDelete.name);

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }

    if (checkIfUsed.length === 0) {
      const { redis, redisSub } = await redisConnection();
      const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
      const rabbitmqPubChan = rabbitMQ.getPubChannel();
      
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses: 1 });
  
      const data = {
        ...itemToDelete,
        eventID
      }

      new ProductBlockageDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Product blockage type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new BadRequestError("Product blockage deletion failed : please check if the product blockage exists or if it's used by any location.");
          }        
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError("Product blockage deletion failed : please check if the product blockage exists or if it's used by any location.");
    }
  }
};