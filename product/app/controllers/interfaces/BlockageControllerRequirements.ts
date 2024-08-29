import { EntityControllerRequirements } from "@zencorp/engrenages";
import { ProductBlockageDatamapperRequirements } from "../../datamappers/interfaces/ProductBlockageDatamapperRequirements"; 

type BlockageDatamapperRequirementsWithoutData = Omit<ProductBlockageDatamapperRequirements, "data">

export interface ProductBlockageControllerRequirements extends EntityControllerRequirements {
  datamapper: BlockageDatamapperRequirementsWithoutData;
};