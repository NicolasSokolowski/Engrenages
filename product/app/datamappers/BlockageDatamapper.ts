import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { pool } from "../database/pg.client";
import { BlockageDatamapperRequirements } from "./interfaces/BlockageDatamapperRequirements";

export class BlockageDatamapper extends CoreDatamapper<BlockageDatamapperRequirements> {
  readonly tableName = TableNames.ProductBlockage;
  pool = pool;
}