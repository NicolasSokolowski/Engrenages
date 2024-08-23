import { BadRequestError, CoreController } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { LocationTypeCreatedPublisher, LocationTypeDeletedPublisher, LocationTypeUpdatedPublisher } from "../../../events/index.events";
import { locationController } from "../index.controllers";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationTypeCreatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: LocationTypeUpdatedPublisher,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["location_type_name"],
        Publisher: LocationTypeDeletedPublisher,
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