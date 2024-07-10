import { CoreDatamapper, TableNames } from "@zencorp/engrenages";
import { Pool } from "pg";
import { pool } from "../database/pg.client";

export interface ProductRequirements {
  tableName: TableNames.Product;
  pool: Pool;
  data: {
    id?: number;
    title: string;
    description: string;
    ean: string;
    length: number;
    width: number;
    height: number;
    product_img: string;
    price: number;
    version?: number;
  }
}

export class ProductDatamapper extends CoreDatamapper<ProductRequirements> {
  readonly tableName = TableNames.Product;
  pool = pool;
}