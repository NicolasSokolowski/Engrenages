import { EntityControllerRequirements } from "@zencorp/engrenages";
import { ProductDatamapperRequirements } from "../../datamappers/interfaces/ProductDatamapperRequirements";

type ProductDatamapperRequirementsWithoutData = Omit<ProductDatamapperRequirements, "data">;

export interface ProductControllerRequirements extends EntityControllerRequirements {
  datamapper: ProductDatamapperRequirementsWithoutData;
  getByPk(id: number): Promise<ProductDatamapperRequirements["data"]>;
  getAll(): Promise<ProductDatamapperRequirements["data"][]>;
  create(item: ProductDatamapperRequirements["data"]): Promise<ProductDatamapperRequirements["data"]>;
  update(item: ProductDatamapperRequirements["data"]): Promise<ProductDatamapperRequirements["data"]>;
  delete(id: number): Promise<ProductDatamapperRequirements["data"]>;
}