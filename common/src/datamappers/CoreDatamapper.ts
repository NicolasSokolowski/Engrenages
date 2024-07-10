import { TableNames } from "./TableNames";
import { Pool } from "pg";

interface entityDatamapperRequirements {
  tableName: TableNames;
  pool: Pool;
  data: any;
}

export abstract class CoreDatamapper<T extends entityDatamapperRequirements> {
  abstract tableName: T["tableName"];
  abstract pool: T["pool"];

  findByPk = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "id" = $1`,
      [id]
    );
    return result.rows[0];
  };

  findAll = async () => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}";`
    );
    return result.rows;
  }

  insert = async (entityObject: T["data"]) => {
    const result = await this.pool.query(
      `SELECT * FROM create_${this.tableName}($1)`,
      [entityObject]
    );
    return result.rows[0];
  }

  update = async (entityObject: T["data"], currentVersion: number) => {
    const result = await this.pool.query(
      `SELECT * FROM update_${this.tableName}($1, $2)`,
      [entityObject, currentVersion]
    );
    return result.rows[0];
  }

  delete = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM delete_${this.tableName}($1)`,
      [id]
    );
    return result.rows[0];
  }  
}