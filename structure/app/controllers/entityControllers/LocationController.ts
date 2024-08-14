import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, makeRandomString, NotFoundError, RabbitmqManager, redisConnection } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";
import { LocationCheckPublisher } from "../../../events/location/LocationCheckPublisher";
import { LocationCreatedPublisher } from "../../../events/location/LocationCreatedPublisher";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    super(datamapper);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    let { zone, alley, position, lvl, lvl_position, location_type_name, location_blockage_name }: Partial<LocationDatamapperRequirements["data"]> = req.body;

    const locationToUpdate = await this.datamapper.findByPk(id);

    if (!locationToUpdate) {
      throw new NotFoundError();
    }

    if (locationToUpdate.version === undefined) {
      throw new BadRequestError("Version information is missing for the product");
    }
    
    const currentVersion: number = locationToUpdate.version;

    zone ? zone : zone = locationToUpdate.zone;
    alley ? alley : alley = locationToUpdate.alley;
    position ? position : position = locationToUpdate.position;
    lvl ? lvl : lvl = locationToUpdate.lvl;
    lvl_position ? lvl_position : lvl_position = locationToUpdate.lvl_position;
    location_type_name ? location_type_name : location_type_name = locationToUpdate.location_type_name;
    location_blockage_name ? location_blockage_name : location_blockage_name = locationToUpdate.location_blockage_name;

    const newDataLocation = { 
      ...locationToUpdate, 
      zone,
      alley,
      position,
      lvl,
      lvl_position,
      location_type_name,
      location_blockage_name
    };

    const updatedLocation = await this.datamapper.update(newDataLocation, currentVersion);

    if (!updatedLocation) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send(updatedLocation);
  }

  requestCreation = async (req: Request, res: Response) => {
    let data = req.body;

    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;

    const checkIfItemExists = await this.datamapper.findBySpecificField("location", newLocation);

    if (checkIfItemExists) {
      throw new BadRequestError(`Location ${newLocation} already exists.`)
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("Redis host must be set");
    }
    
    const { redis, redisSub } = await redisConnection();
    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    let eventID = makeRandomString(10) + `${newLocation}`;
    await redis.createTransaction({ eventID, expectedResponses: 1 });

    data = {
      ...data,
      newLocation,
      eventID
    }

    new LocationCheckPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

    await redisSub.subscribe(eventID, async (isSuccessful) => {
      if (isSuccessful) {
        console.log("Data checked successfuly, proceeding to location creation");
        const createdItem = await this.datamapper.insert(data);
        eventID = makeRandomString(10) + `${newLocation}`;

        await redis.createTransaction({ eventID, expectedResponses: 1 });
        
        data = {
          ...data,
          eventID
        }

        new LocationCreatedPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

        await redisSub.subscribe(eventID, async (isSuccessful) => {
          if (isSuccessful) {
            console.log("Location created successfully");
            res.send(createdItem);
          } else {
            throw new Error("A service failed location creation");
          }
        })
      } else {
        throw new Error("The check failed, please contact an administrator.");
      }
    });
  }
}