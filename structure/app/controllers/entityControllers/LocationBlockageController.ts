import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCheckPublisher } from "../../../events/location_blockage/LocationBlockageCheckPublisher";
import { LocationBlockageCreatedPublisher } from "../../../events/location_blockage/LocationBlockageCreatedPublisher";
import { LocationBlockageUpdatedPublisher } from "../../../events/location_blockage/LocationBlockageUpdatedPublisher";
import { LocationBlockageDeletedPublisher } from "../../../events/location_blockage/LocationBlockageDeletedPublisher";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
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
    
    new LocationBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to location blockage creation");
        const createdItem = await this.datamapper.insert(data);
        eventID = makeRandomString(10) + `${data.name}`;

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...data,
          eventID
        }

        new LocationBlockageCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location blockage created successfully");
            res.send(createdItem);
          } else {
            throw new Error("A service failed location blockage creation");
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
    
    let eventID = makeRandomString(10);
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID,
      id
    }

    new LocationBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to location type update");
        let updatedItem = await this.datamapper.update(data, itemToUpdate.version);
        eventID = makeRandomString(10);

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...updatedItem,
          eventID
        }

        new LocationBlockageUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location blockage updated successfully");
            res.send(updatedItem);
          } else {
            throw new Error("A service failed location blockage update");
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

    new LocationBlockageCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

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

        new LocationBlockageDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new Error("A service failed location blockage deletion");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    })
  }
}