import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface LocationDatamapperRequirements extends EntityDatamapperRequirements {
  readonly tableName: TableNames;
  data: {
    id?: number;
    location: string;
    location_type_name: string;
    location_blockage_name?: string;
    version?: number;
  }
}