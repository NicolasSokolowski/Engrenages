import { CoreController } from "@zencorp/engrenages";
import { LocationBlockageControllerRequirements } from "../interfaces/LocationBlockageControllerRequirements";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";
import { LocationBlockageCreatedPublisher } from "../../../events/publishers/location_blockage/LocationBlockageCreatedPublisher";
import { LocationBlockageUpdatedPublisher } from "../../../events/publishers/location_blockage/LocationBlockageUpdatedPublisher";
import { LocationBlockageDeletedPublisher } from "../../../events/publishers/location_blockage/LocationBlockageDeletedPublisher";

export class LocationBlockageController extends CoreController<LocationBlockageControllerRequirements, LocationBlockageDatamapperRequirements> {
  constructor(datamapper: LocationBlockageControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationBlockageCreatedPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: LocationBlockageUpdatedPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["location_blockage_name"],
        Publisher: LocationBlockageDeletedPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}