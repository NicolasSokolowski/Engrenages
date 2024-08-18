import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { UserDatamapperRequirements } from "../interfaces/UserDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class UserDatamapper extends CoreDatamapper<UserDatamapperRequirements> {
  readonly tableName = TableNames.User;
  pool = pool;

  findByEmail = async (email: string) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "email" = $1`,
      [email]
    );
    return result.rows[0];
  }
}