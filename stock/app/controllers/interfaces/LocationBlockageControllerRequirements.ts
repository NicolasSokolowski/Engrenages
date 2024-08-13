import { EntityControllerRequirements } from "@zencorp/engrenages";
import { LocationBlockageDatamapperRequirements } from "../../datamappers/interfaces/LocationBlockageDatamapperRequirements";

type LocationBlockageRequirementsWithoutData = Omit<LocationBlockageDatamapperRequirements, "data">;

export interface LocationBlockageControllerRequirements extends EntityControllerRequirements {
  datamapper: LocationBlockageRequirementsWithoutData;
}