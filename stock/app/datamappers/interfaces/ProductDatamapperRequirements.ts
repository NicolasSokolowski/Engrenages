import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface ProductDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.Product;
  data: {
    id?: number;
    title: string;
    ean: string;
    length: number;
    width: number;
    height: number;
    product_img: string;
    product_blockage_name: string;
    version?: number;
  };
}