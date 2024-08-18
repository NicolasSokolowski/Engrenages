import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { pool } from "../../database/pg.client";
import { ProductBlockageDatamapperRequirements } from "../interfaces/ProductBlockageDatamapperRequirements";

export class ProductBlockageDatamapper extends CoreDatamapper<ProductBlockageDatamapperRequirements> {
  readonly tableName = TableNames.ProductBlockage;
  pool = pool;
}