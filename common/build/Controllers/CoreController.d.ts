import { EntityDatamapperRequirements } from "../common_interfaces/EntityDatamapperRequirements";
import { Request, Response } from "express";
type EntityDatamapperRequirementsWithoutData = Omit<EntityDatamapperRequirements, "data">;
export declare abstract class CoreController<T extends EntityDatamapperRequirements> {
    datamapper: EntityDatamapperRequirementsWithoutData;
    abstract update(req: Request, res: Response): Promise<void>;
    constructor(datamapper: EntityDatamapperRequirementsWithoutData);
    getByPk: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
export {};
