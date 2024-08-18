import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";
import { LocationCreatedPublisher, LocationDeletedPublisher, LocationUpdatedPublisher } from "../../../events/index.events";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body;

    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;

    const checkIfItemExists = await this.datamapper.findBySpecificField("location", newLocation);

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
        newLocation,
        eventID
      }
      
      new LocationCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const createdItem = await this.datamapper.insert(data);
            console.log("Location created successfully");
            res.send(createdItem);
          } else {
            throw new BadRequestError("A service failed location creation");
          }
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError(`Location ${newLocation} already exists.`)
    }
  }

  requestUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    const itemToUpdate = await this.datamapper.findByPk(id);

    if (!itemToUpdate) {
      throw new NotFoundError();
    }
    
    const updateFields = [
      'zone', 
      'alley', 
      'position', 
      'lvl', 
      'lvl_position'
    ];
    
    for (const field of updateFields) {
      if (data[field] === undefined) {
        data[field] = itemToUpdate[field];
      }
    }
    
    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;
    
    const checkIfEntreeExists = await this.datamapper.findBySpecificField("location", newLocation);
    
    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }

    if (!checkIfEntreeExists) {
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
  
      new LocationUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const updatedItem = await this.datamapper.update(data, itemToUpdate.version);
            console.log("Location updated successfully");
            res.status(200).send(updatedItem);
          } else {
            throw new BadRequestError("A service failed location update");
          }          
        } catch (err) {
          next(err);
        }
      })
    } else {
      throw new BadRequestError(`Location ${newLocation} already exists.`);
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

      new LocationDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);
  
      await redisSub.subscribe(eventID, async (isSuccessful) => {
        try {
          if (isSuccessful) {
            const deletedItem = await this.datamapper.delete(id);
            console.log("Location deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new BadRequestError("A service failed location deletion. Please check if the location exists and if it's not occupied by any product.");
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