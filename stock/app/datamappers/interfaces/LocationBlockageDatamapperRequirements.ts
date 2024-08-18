import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface LocationBlockageDatamapperRequirements extends EntityDatamapperRequirements {
  readonly tableName: TableNames;
  data: {
    id?: number;
    name: string;
    version?: string;
  }
}