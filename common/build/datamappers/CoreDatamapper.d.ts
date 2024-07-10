import { TableNames } from "./TableNames";
import { Pool } from "pg";
interface entityDatamapperRequirements {
    tableName: TableNames;
    pool: Pool;
    data: any;
}
export declare abstract class CoreDatamapper<T extends entityDatamapperRequirements> {
    abstract tableName: T["tableName"];
    abstract pool: T["pool"];
    findByPk: (id: number) => Promise<any>;
    findAll: () => Promise<any[]>;
    insert: (entityObject: T["data"]) => Promise<any>;
    update: (entityObject: T["data"], currentVersion: number) => Promise<any>;
    delete: (id: number) => Promise<any>;
}
export {};
