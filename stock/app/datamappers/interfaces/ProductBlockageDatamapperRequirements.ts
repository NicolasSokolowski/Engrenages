import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface ProductBlockageDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.ProductBlockage;
  data: {
    id?: number;
    name: string;
    version?: number;
  }
}