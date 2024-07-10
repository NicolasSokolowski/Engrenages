import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";
import { Pool } from "pg";

export interface ProductDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.Product;
  pool: Pool;
  data: {
    id?: number;
    title: string;
    description: string;
    ean: string;
    length: number;
    width: number;
    height: number;
    product_img: string;
    price: number;
    version?: number;
  };
  findByPk(id: number): Promise<ProductDatamapperRequirements["data"]>;
  findAll(): Promise<ProductDatamapperRequirements["data"][]>;
  insert(item: ProductDatamapperRequirements["data"]): Promise<ProductDatamapperRequirements["data"]>;
  update(item: ProductDatamapperRequirements["data"], currentVersion: number): Promise<ProductDatamapperRequirements["data"]>;
  delete(id: number): Promise<ProductDatamapperRequirements["data"]>;
}