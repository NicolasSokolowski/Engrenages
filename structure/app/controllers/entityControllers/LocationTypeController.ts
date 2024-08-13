import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { LocationTypeCheckPublisher } from "../../../events/location_type/LocationTypeCheckPublisher";
import { LocationTypeCreatedPublisher } from "../../../events/location_type/LocationTypeCreatedPublisher";
import { LocationTypeUpdatedPublisher } from "../../../events/location_type/LocationTypeUpdatedPublisher";
import { LocationTypeDeletedPublisher } from "../../../events/location_type/LocationTypeDeletedPublisher";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response) => {
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
    
    let eventID = makeRandomString(10) + `${data.name}`;
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID
    }

    new LocationTypeCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to location type creation");
        const createdItem = await this.datamapper.insert(data);
        eventID = makeRandomString(10) + `${data.name}`;

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...data,
          eventID
        }

        new LocationTypeCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location type created successfully");
            res.send(createdItem);
          } else {
            throw new Error("A service failed location type creation");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    });
  }

  requestUpdate = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    let data = req.body;

    const checkIfItemExists = await this.datamapper.findBySpecificField("name", data.name);

    if (checkIfItemExists) {
      throw new BadRequestError(`Location type ${data.name} already exists.`)
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
    
    let eventID = makeRandomString(10) + `${data.name}`;
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      eventID,
      id
    }

    new LocationTypeCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to location type update");
        let updatedItem = await this.datamapper.update(data, itemToUpdate.version);
        eventID = makeRandomString(10) + `${data.name}`;

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...updatedItem,
          eventID
        }

        new LocationTypeUpdatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location type updated successfully");
            res.send(updatedItem);
          } else {
            throw new Error("A service failed location type update");
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

    new LocationTypeCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

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

        new LocationTypeDeletedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location type deleted successfully");
            res.status(200).send(deletedItem);
          } else {
            throw new Error("A service failed location type deletion");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    })
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name, description, length, width, height }: Partial<LocationTypeDatamapperRequirements["data"]> = req.body;

    const locationTypeToUpdate = await this.datamapper.findByPk(id);

    if (!locationTypeToUpdate) {
      throw new NotFoundError();
    }

    if (locationTypeToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationTypeToUpdate.version;

    name ? name : name = locationTypeToUpdate.name;
    description ? description : description = locationTypeToUpdate.description;
    length ? length : length = locationTypeToUpdate.length;
    width ? width : width = locationTypeToUpdate.width;
    height ? height : height = locationTypeToUpdate.height;

    const newDataLocationType = { 
      ...locationTypeToUpdate, 
      name,
      description,
      length,
      width,
      height
    };

    const updatedLocationType = await this.datamapper.update(newDataLocationType, currentVersion);

    if (!updatedLocationType) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocationType);
  }

}