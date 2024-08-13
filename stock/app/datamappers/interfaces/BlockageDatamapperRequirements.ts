import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface BlockageDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.ProductBlockage;
  data: {
    id?: number;
    name: string;
    version?: number;
  }
}