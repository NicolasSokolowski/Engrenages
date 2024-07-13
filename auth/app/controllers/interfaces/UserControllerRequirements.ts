import { EntityControllerRequirements } from "@zencorp/engrenages";
import { UserDatamapperRequirements } from "../../datamappers/interfaces/UserDatamapperRequirements";

type UserDatamapperRequirementsWithtoutData = Omit<UserDatamapperRequirements, "data">;

export interface UserControllerRequirements extends EntityControllerRequirements {
  datamapper: UserDatamapperRequirementsWithtoutData;
}