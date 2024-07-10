import { Pool } from "pg";
import { TableNames } from "../datamappers/TableNames";

export interface EntityDatamapperRequirements {
  tableName: TableNames;
  pool: Pool;
  data: any;
  findByPk(id: number): Promise<EntityDatamapperRequirements["data"]>;
  findAll(): Promise<EntityDatamapperRequirements["data"][]>;
  insert(item: EntityDatamapperRequirements["data"]): Promise<EntityDatamapperRequirements["data"]>;
  update(item: EntityDatamapperRequirements["data"], currentVersion: number): Promise<EntityDatamapperRequirements["data"]>;
  delete(id: number): Promise<EntityDatamapperRequirements["data"]>;
}