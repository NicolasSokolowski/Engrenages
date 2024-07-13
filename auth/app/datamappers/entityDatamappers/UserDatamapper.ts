import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { UserDatamapperRequirements } from "../interfaces/UserDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class UserDatamapper extends CoreDatamapper<UserDatamapperRequirements> {
  readonly tableName = TableNames.User;
  pool = pool;
}