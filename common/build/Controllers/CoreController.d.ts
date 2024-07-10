import { Request, Response } from "express";
import { EntityControllerRequirements } from "./EntityControllerRequirements";
import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
export declare abstract class CoreController<T extends EntityControllerRequirements, Y extends EntityDatamapperRequirements> {
    datamapper: T["datamapper"];
    abstract update(req: Request, res: Response): Promise<void>;
    constructor(datamapper: T["datamapper"]);
    getByPk: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
