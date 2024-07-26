import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { LocationBlockageDatamapperRequirements } from "../interfaces/LocationBlockageDatamapperRequirements";
import { pool } from "../../database/pg.client";

export class LocationBlockageDatamapper extends CoreDatamapper<LocationBlockageDatamapperRequirements> {
  readonly tableName = TableNames.LocationBlockageType;
  pool = pool;
}