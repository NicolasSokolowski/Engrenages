import { EntityControllerRequirements } from "@zencorp/engrenages";
import { RoleDatamapperRequirements } from "../../datamappers/interfaces/RoleDatamapperRequirements";

type RoleDatamapperRequirementsWithoutData = Omit<RoleDatamapperRequirements, "data">

export interface RoleControllerRequirements extends EntityControllerRequirements {
  datamapper: RoleDatamapperRequirementsWithoutData;
};