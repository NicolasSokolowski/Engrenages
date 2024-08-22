import { NextFunction, Request, Response } from "express";
import { EntityControllerRequirements } from "./EntityControllerRequirements";
import { EntityDatamapperRequirements } from "../datamappers/EntityDatamapperRequirements";
export interface CoreConfig {
    fields: string[];
    Publisher: any;
    exchangeName: string;
    expectedResponses: number;
}
export declare abstract class CoreController<T extends EntityControllerRequirements, Y extends EntityDatamapperRequirements> {
    datamapper: T["datamapper"];
    protected configs: {
        [key: string]: CoreConfig;
    };
    constructor(datamapper: T["datamapper"], configs: {
        [key: string]: CoreConfig;
    });
    getConfig(method: string): CoreConfig;
    getByPk: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    getBySpecificField: (field: string, value: string) => Promise<any>;
    create: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    requestCreation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
