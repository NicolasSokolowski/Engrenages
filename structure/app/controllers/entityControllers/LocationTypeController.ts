import { BadRequestError, CoreController } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { locationController } from "../index.controllers";
import { LocationTypeCreationRequestPublisher, LocationTypeDeletionRequestPublisher, LocationTypeUpdateRequestPublisher } from "../../../events/index.events";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationTypeCreationRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: LocationTypeUpdateRequestPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["location_type_name"],
        Publisher: LocationTypeDeletionRequestPublisher,
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