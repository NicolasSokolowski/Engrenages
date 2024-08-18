import { EntityControllerRequirements } from "@zencorp/engrenages";
import { BlockageDatamapperRequirements } from "../../datamappers/interfaces/BlockageDatamapperRequirements";

type BlockageDatamapperRequirementsWithoutData = Omit<BlockageDatamapperRequirements, "data">

export interface BlockageControllerRequirements extends EntityControllerRequirements {
  datamapper: BlockageDatamapperRequirementsWithoutData;
};