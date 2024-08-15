import { EntityControllerRequirements } from "@zencorp/engrenages";
import { ProductBlockageDatamapperRequirements } from "../../datamappers/interfaces/ProductBlockageDatamapperRequirements";

type ProductBlockageDatamapperRequirementsWithoutData = Omit<ProductBlockageDatamapperRequirements, "data">

export interface ProductBlockageControllerRequirements extends EntityControllerRequirements {
  datamapper: ProductBlockageDatamapperRequirementsWithoutData;
};