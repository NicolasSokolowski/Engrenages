import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { LocationTypeDatamapperRequirements } from "../interfaces/LocationTypeDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class LocationTypeDatamapper extends CoreDatamapper<LocationTypeDatamapperRequirements> {
  readonly tableName = TableNames.LocationType;
  pool = pool;
}