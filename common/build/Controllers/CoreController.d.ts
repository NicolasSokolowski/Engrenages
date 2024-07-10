import { EntityDatamapperRequirements } from "../common_interfaces/EntityDatamapperRequirements";
import { Request, Response } from "express";
export declare abstract class CoreController<T extends EntityDatamapperRequirements> {
    datamapper: T;
    abstract update(req: Request, res: Response): Promise<void>;
    constructor(datamapper: T);
    getByPk: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
