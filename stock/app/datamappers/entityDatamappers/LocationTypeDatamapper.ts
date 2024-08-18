import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { LocationTypeDatamapperRequirements } from "../interfaces/LocationTypeDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class LocationTypeDatamapper extends CoreDatamapper<LocationTypeDatamapperRequirements> {
  readonly tableName = TableNames.LocationType;
  pool = pool;

  findBySpecificField = async (field: string, value: string) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE ${field} = $1`,
      [value]
    );
    return result.rows[0];
  }
}