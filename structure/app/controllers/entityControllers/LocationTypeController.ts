import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { LocationTypeCreatedPublisher, LocationTypeDeletedPublisher, LocationTypeUpdatedPublisher } from "../../../events/index.events";
import { locationController } from "../index.controllers";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

    if (checkIfItemExists) {
      throw new BadRequestError(`Location type ${data.name} already exists.`)
    }

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
  
      new LocationTypeCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const createdItem = await this.datamapper.insert(data);
            console.log("Location type created successfully");
            res.status(201).send(createdItem);
          } else {
            throw new BadRequestError("A service failed location type creation");
          }
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError(`Location type ${data.name} already exists.`);
    }
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    if (data.name) {
      const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

      if (checkIfItemExists) {
        throw new BadRequestError(`Location type ${data.name} already exists.`)
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
  
      new LocationTypeUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
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

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    const checkIfUsed = await locationController.datamapper.checkIfUsed("location_type_name", itemToDelete.name);

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

      new LocationTypeDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Location type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new BadRequestError("A service failed location type deletion");
          }          
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError("Location type deletion failed : please check if the location type exists or if it's used by any location.");
    }
  }
}