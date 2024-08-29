import { BadRequestError, CoreController } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { locationController } from "../index.controllers";
import { LocationBlockageCreationRequestPublisher, LocationBlockageDeletionRequestPublisher, LocationBlockageUpdateRequestPublisher } from "../../../events/index.events";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationBlockageCreationRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: LocationBlockageUpdateRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["location_blockage_name"],
        Publisher: LocationBlockageDeletionRequestPublisher,
        exchangeName: "logisticExchange"
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