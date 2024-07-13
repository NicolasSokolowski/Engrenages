import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { RoleDatamapperRequirements } from "../interfaces/RoleDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class RoleDatamapper extends CoreDatamapper<RoleDatamapperRequirements> {
  readonly tableName = TableNames.Role;
  pool = pool;
}