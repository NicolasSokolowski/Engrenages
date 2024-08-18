import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { LocationDatamapperRequirements } from "../interfaces/LocationDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class LocationDatamapper extends CoreDatamapper<LocationDatamapperRequirements> {
  readonly tableName = TableNames.Location;
  pool = pool;
}