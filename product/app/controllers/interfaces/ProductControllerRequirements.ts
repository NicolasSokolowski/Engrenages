import { EntityControllerRequirements } from "@zencorp/engrenages";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";

type ProductDatamapperRequirementsWithoutData = Omit<ProductDatamapperRequirements, "data">;

export interface ProductControllerRequirements extends EntityControllerRequirements {
  datamapper: ProductDatamapperRequirementsWithoutData;
}