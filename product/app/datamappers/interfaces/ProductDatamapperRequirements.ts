import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface ProductDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.Product;
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
    product_blockage_name: string;
    version?: number;
  };
}