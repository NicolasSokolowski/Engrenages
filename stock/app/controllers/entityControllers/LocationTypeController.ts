import { CoreController } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { LocationTypeCreatedConsumer, LocationTypeDeletedConsumer, LocationTypeUpdatedConsumer } from "../../../events/index.events";

export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationTypeCreatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: LocationTypeUpdatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["location_type_name"],
        Publisher: LocationTypeDeletedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}