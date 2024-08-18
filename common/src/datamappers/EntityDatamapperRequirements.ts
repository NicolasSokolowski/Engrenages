import { Pool } from "pg";
import { TableNames } from "./TableNames";

export interface EntityDatamapperRequirements {
  tableName: TableNames;
  pool: Pool;
  data: any;
  findByPk(id: number): Promise<EntityDatamapperRequirements["data"]>;
  findAll(): Promise<EntityDatamapperRequirements["data"][]>;
  findBySpecificField(field: string, value: string): Promise<EntityDatamapperRequirements["data"]>;
  insert(item: EntityDatamapperRequirements["data"]): Promise<EntityDatamapperRequirements["data"]>;
  update(item: EntityDatamapperRequirements["data"], currentVersion: number): Promise<EntityDatamapperRequirements["data"]>;
  delete(id: number): Promise<EntityDatamapperRequirements["data"]>;
  checkIfUsed(fieldName: string, value: string): Promise<any>;
  checkIfNotNull(fieldName: string, id: number): Promise<any>;
}