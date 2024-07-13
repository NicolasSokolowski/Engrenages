import { EntityDatamapperRequirements, TableNames } from "@zencorp/engrenages";

export interface UserDatamapperRequirements extends EntityDatamapperRequirements {
  tableName: TableNames.User;
  data: {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_name: string;
    version?: number;
  }
}