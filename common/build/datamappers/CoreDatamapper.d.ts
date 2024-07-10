import { EntityDatamapperRequirements } from "../common_interfaces/EntityDatamapperRequirements";
export declare abstract class CoreDatamapper<T extends EntityDatamapperRequirements> {
    abstract tableName: T["tableName"];
    abstract pool: T["pool"];
    findByPk: (id: number) => Promise<any>;
    findAll: () => Promise<any[]>;
    insert: (entityObject: T["data"]) => Promise<any>;
    update: (entityObject: T["data"], currentVersion: number) => Promise<any>;
    delete: (id: number) => Promise<any>;
}
