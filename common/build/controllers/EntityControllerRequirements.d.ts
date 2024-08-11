import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
type EntityDatamapperRequirementsWithoutData = Omit<EntityDatamapperRequirements, "data">;
export interface EntityControllerRequirements {
    datamapper: EntityDatamapperRequirementsWithoutData;
    getByPk(): Promise<void>;
    getAll(): Promise<void>;
    getBySpecificField(): Promise<EntityDatamapperRequirements["data"] | null>;
    create(): Promise<void>;
    update(): Promise<void>;
    delete(): Promise<void>;
}
export {};
