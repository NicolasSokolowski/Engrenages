import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface RoleDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.Role;
  data: {
    id?: number;
    name: string;
    version?: number;
  }
}