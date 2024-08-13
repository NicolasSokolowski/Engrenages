import { EntityControllerRequirements } from "@zencorp/engrenages";
import { LocationDatamapperRequirements } from "../../datamappers/interfaces/LocationDatamapperRequirements";

type LocationDatamapperRequirementsWithoutData = Omit<LocationDatamapperRequirements, "data">;

export interface LocationControllerRequirements extends EntityControllerRequirements {
  datamapper: LocationDatamapperRequirementsWithoutData;
}