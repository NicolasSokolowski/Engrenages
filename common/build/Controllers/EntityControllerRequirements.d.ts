import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
type EntityDatamapperRequirementsWithoutData = Omit<EntityDatamapperRequirements, "data">;
export interface EntityControllerRequirements {
    datamapper: EntityDatamapperRequirementsWithoutData;
    getByPk(id: number): Promise<EntityDatamapperRequirements["data"]>;
    getAll(): Promise<EntityDatamapperRequirements["data"][]>;
    create(item: EntityDatamapperRequirements["data"]): Promise<EntityDatamapperRequirements["data"]>;
    update(item: EntityDatamapperRequirements["data"]): Promise<EntityDatamapperRequirements["data"]>;
    delete(id: number): Promise<EntityDatamapperRequirements["data"]>;
}
export {};
