import { RoleDatamapperRequirements } from "../interfaces/RoleDatamapperRequirements";
import { pool } from "../../database/pg.client";
import { CoreDatamapper, TableNames } from "@zencorp/engrenages";

export class RoleDatamapper extends CoreDatamapper<RoleDatamapperRequirements> {
  readonly tableName = TableNames.Role;
  pool = pool;
}