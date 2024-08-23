import { Request, Response } from "express";
import { BadRequestError, CoreController, DatabaseConnectionError, NotFoundError, RabbitmqManager } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";
import { LocationDeletedConsumer } from "../../../events/index.events";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    const configs = {
      "delete": {
        fields: [],
        Publisher: LocationDeletedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}