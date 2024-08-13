import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { pool } from "../../database/pg.client";
import { ProductDatamapperRequirements } from "../interfaces/ProductDatamapperRequirements";

export class ProductDatamapper extends CoreDatamapper<ProductDatamapperRequirements> {
  readonly tableName = TableNames.Product;
  pool = pool;
}