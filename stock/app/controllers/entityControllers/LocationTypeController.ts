import { CoreController } from "@zencorp/engrenages";
import { LocationTypeControllerRequirements } from "../interfaces/LocationTypeControllerRequirements";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";
import { LocationTypeCreatedPublisher } from "../../../events/publishers/location_type/LocationTypeCreatedPublisher";
import { LocationTypeUpdatedPublisher } from "../../../events/publishers/location_type/LocationTypeUpdatedPublisher";
import { LocationTypeDeletedPublisher } from "../../../events/publishers/location_type/LocationTypeDeletedPublisher";


export class LocationTypeController extends CoreController<LocationTypeControllerRequirements, LocationTypeDatamapperRequirements> {
  constructor(datamapper: LocationTypeControllerRequirements["datamapper"]) {
    const configs = {
      "create": {
        fields: ["name"],
        Publisher: LocationTypeCreatedPublisher,
        exchangeName: "logisticExchange"
      },
      "update": {
        fields: ["name"],
        Publisher: LocationTypeUpdatedPublisher,
        exchangeName: "logisticExchange"
      },
      "delete": {
        fields: ["location_type_name"],
        Publisher: LocationTypeDeletedPublisher,
        exchangeName: "logisticExchange"
      }
    }
    super(datamapper, configs);
    this.datamapper = datamapper;
  }
}