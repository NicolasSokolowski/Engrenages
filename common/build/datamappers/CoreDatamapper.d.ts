import { EntityDatamapperRequirements } from "./EntityDatamapperRequirements";
export declare abstract class CoreDatamapper<T extends EntityDatamapperRequirements> {
    abstract tableName: T["tableName"];
    abstract pool: T["pool"];
    findByPk: (id: number) => Promise<any>;
    findAll: () => Promise<any[]>;
    findBySpecificField: (field: string, value: string) => Promise<any>;
    insert: (entityObject: T["data"]) => Promise<any>;
    update: (entityObject: T["data"], currentVersion: number) => Promise<any>;
    delete: (id: number) => Promise<any>;
}
