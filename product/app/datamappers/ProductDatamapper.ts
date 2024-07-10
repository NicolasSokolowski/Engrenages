import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { pool } from "../database/pg.client";
import { ProductRequirements } from "../interfaces/ProductRequirements";

export class ProductDatamapper extends CoreDatamapper<ProductRequirements> {
  readonly tableName = TableNames.Product;
  pool = pool;
}