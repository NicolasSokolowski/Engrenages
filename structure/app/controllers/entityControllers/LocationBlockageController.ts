import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCreatedPublisher, LocationBlockageDeletedPublisher, LocationBlockageUpdatedPublisher } from "../../../events/index.events";
import { locationController } from "../index.controllers";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let data = req.body;

    const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    if (!checkIfItemExists) {
      let eventID = makeRandomString(10);
      await redis.createTransaction({ eventID, expectedResponses: 1 });
  
      data = {
        ...data,
        eventID
      }
      
      new LocationBlockageCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const createdItem = await this.datamapper.insert(data);
            console.log("Location blockage created successfully");
            res.send(createdItem);
          } else {
            throw new BadRequestError("A service failed location blockage creation");
          }
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError(`Location blockage ${data.name} already exists.`)
    }
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfItemExists) {
        throw new BadRequestError(`Location blockage ${data.name} already exists.`)
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
  
      new LocationBlockageUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
            console.log("Location blockage updated successfully");
            res.status(200).send(updatedItem);
          } else {
            throw new BadRequestError("A service failed location blockage update");
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

    const checkIfUsed = await locationController.datamapper.checkIfUsed("location_blockage_name", itemToDelete.name);

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

      new LocationBlockageDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Location blockage type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new BadRequestError("A service failed location blockage deletion");
          }          
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError("Location blockage deletion failed : please check if the location blockage exists or if it's used by any location.");
    }
  }
}