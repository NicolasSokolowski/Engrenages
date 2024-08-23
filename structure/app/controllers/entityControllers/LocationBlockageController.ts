import { BadRequestError, CoreController } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCreatedPublisher, LocationBlockageDeletedPublisher, LocationBlockageUpdatedPublisher } from "../../../events/index.events";
import { locationController } from "../index.controllers";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationBlockageCreatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: LocationBlockageUpdatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["location_blockage_name"],
        Publisher: LocationBlockageDeletedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }

  preDeletionCheck = async (fields: string[], value: any): Promise<void> => {
    const checkIfUsed = await Promise.any(fields.map((field) => locationController.datamapper.findBySpecificField(field, value.name)));

    if (checkIfUsed) {
      throw new BadRequestError("Item still in use.")
    }
  };
}