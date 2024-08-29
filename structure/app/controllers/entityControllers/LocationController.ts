import { NextFunction, Request, Response } from "express";
import { BadRequestError, CoreController, makeRandomString, NotFoundError, RabbitmqManager } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";
import { LocationCreationRequestPublisher, LocationDeletionRequestPublisher, LocationUpdateRequestPublisher } from "../../../events/index.events";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    const configs = {
      "delete": {
        fields: [],
        Publisher: LocationDeletionRequestPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }

  requestCreation = async (req: Request, res: Response) => {
    let data = req.body;

    const newLocation = `${data.zone}-${data.alley}-${data.position}-${data.lvl}-${data.lvl_position}`;

    const checkIfItemExists = await this.datamapper.findBySpecificField("location", newLocation);

    const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
    const rabbitmqPubChan = rabbitMQ.getPubChannel();
    
    if (!checkIfItemExists) {
  
      data = {
        ...data,
        newLocation
      }
      
      new LocationCreationRequestPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

      res.status(202).send({ message: "Traitement de la demande de création en cours..."});

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

    if (!checkIfEntreeExists) {
      const rabbitMQ = await RabbitmqManager.getInstance(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`);
      const rabbitmqPubChan = rabbitMQ.getPubChannel();
  
      data = {
        ...data,
        version: itemToUpdate.version,
        id
      }
  
      new LocationUpdateRequestPublisher(rabbitmqPubChan, "logisticExchange").publish(data);

      res.status(202).send({ message: "Traitement de la demande de modification en cours..."});

    } else {
      throw new BadRequestError(`Location ${newLocation} already exists.`);
    }
  }
}