import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCheckPublisher } from "../../../events/location_blockage/LocationBlockageCheckPublisher";
import { LocationBlockageCreatedPublisher } from "../../../events/location_blockage/LocationBlockageCreatedPublisher";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { name, description }: Partial<LocationBlockageDatamapperRequirements["data"]> = req.body;

    const locationBlockageToUpdate = await this.datamapper.findByPk(id);

    if (!locationBlockageToUpdate) {
      throw new NotFoundError();
    }

    if (locationBlockageToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationBlockageToUpdate.version;

    name ? name : name = locationBlockageToUpdate.name;
    description ? description : description = locationBlockageToUpdate.description;

    const newDataLocationBlockage = { 
      ...locationBlockageToUpdate, 
      name,
      description
    };

    const updatedLocationBlockage = await this.datamapper.update(newDataLocationBlockage, currentVersion);

    if (!updatedLocationBlockage) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocationBlockage);    
  }

  requestCreation = async (req: Request, res: Response): Promise<void> => {
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
}