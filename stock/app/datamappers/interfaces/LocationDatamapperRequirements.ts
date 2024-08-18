import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface LocationDatamapperRequirements extends EntityDatamapperRequirements {
  readonly tableName: TableNames;
  data: {
    id?: number;
    zone: string;
    alley: string;
    position: string;
    lvl: string;
    lvl_position: string;
    location?: string;
    location_type_name?: string;
    location_blockage_name?: string;
    version?: number;
  }
}