import { EntityControllerRequirements } from "@zencorp/engrenages";
import { LocationTypeDatamapperRequirements } from "../../datamappers/interfaces/LocationTypeDatamapperRequirements";

type LocationTypeDatamapperRequirementsWithoutData = Omit<LocationTypeDatamapperRequirements, "data">;

export interface LocationTypeControllerRequirements extends EntityControllerRequirements {
  datamapper: LocationTypeDatamapperRequirementsWithoutData;
}