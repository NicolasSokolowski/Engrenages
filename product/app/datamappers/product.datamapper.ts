import { pool } from "../database/pg.client";

export interface ProductInterface {
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

export interface ProductDatamapperInterface {
  tableName: string;
  findByPk(productID: number): Promise<ProductInterface>;
  findAll(): Promise<ProductInterface[]>;
  insert(product: ProductInterface): Promise<ProductInterface>;
  update(product: ProductInterface, currentVersion: number): Promise<ProductInterface>;
  delete(productID: number): Promise<ProductInterface>;
}

export class ProductDatamapper implements ProductDatamapperInterface{
  tableName = "product";

  findByPk = async (productID: number) => {
    const result = await pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "id" = $1`,
      [productID]
    );
    return result.rows[0];
  };

  findAll = async () => {
    const result = await pool.query(
      `SELECT * FROM "${this.tableName}";`
    );
    return result.rows;
  }

  insert = async (product: ProductInterface) => {
    const result = await pool.query(
      `SELECT * FROM create_${this.tableName}($1)`,
      [product]
    );
    return result.rows[0];
  }

  update = async (product: ProductInterface, currentVersion: number) => {
    const result = await pool.query(
      `SELECT * FROM update_${this.tableName}($1, $2)`,
      [product, currentVersion]
    );
    return result.rows[0];
  }

  delete = async (productID: number) => {
    const result = await pool.query(
      `SELECT * FROM delete_${this.tableName}($1)`,
      [productID]
    );
    return result.rows[0];
  }
}