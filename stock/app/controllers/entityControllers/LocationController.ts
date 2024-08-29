import { CoreController } from "@zencorp/engrenages";
import { LocationControllerRequirements } from "../interfaces/LocationControllerRequirements";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";
import { LocationDeletedPublisher } from "../../../events/publishers/location/LocationDeletedPublisher";
import { LocationCreatedPublisher } from "../../../events/publishers/location/LocationCreatedPublisher";
import { LocationUpdatedPublisher } from "../../../events/publishers/location/LocationUpdatedPublisher";

export class LocationController extends CoreController<LocationControllerRequirements, LocationDatamapperRequirements> {
  constructor(datamapper: LocationControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: [],
        Publisher: LocationCreatedPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: [],
        Publisher: LocationUpdatedPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: [],
        Publisher: LocationDeletedPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}