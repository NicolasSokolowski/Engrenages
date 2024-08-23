import { CoreController } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCreatedConsumer, LocationBlockageDeletedConsumer, LocationBlockageUpdatedConsumer, ProductBlockageCreatedConsumer, ProductBlockageDeletedConsumer, ProductBlockageUpdatedConsumer } from "../../../events/index.events";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationBlockageCreatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "update": {
        fields: ["name"],
        Publisher: LocationBlockageUpdatedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      },
      "delete": {
        fields: ["location_blockage_name"],
        Publisher: LocationBlockageDeletedConsumer,
        exchangeName: "logisticExchange",
        expectedResponses: 1
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}