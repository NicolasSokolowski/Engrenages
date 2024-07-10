import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";
import { Pool } from "pg";

export interface ProductRequirements extends EntityDatamapperRequirements {
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
  findByPk(id: number): Promise<ProductRequirements["data"]>;
  findAll(): Promise<ProductRequirements["data"][]>;
  insert(item: ProductRequirements["data"]): Promise<ProductRequirements["data"]>;
  update(item: ProductRequirements["data"], currentVersion: number): Promise<ProductRequirements["data"]>;
  delete(id: number): Promise<ProductRequirements["data"]>;
}