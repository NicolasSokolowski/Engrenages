import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface LocationTypeDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames;
  data: {
    id?: number;
    name: string;
    length: number;
    width: number;
    height: number;
    version?: number;
  }
}