import Joi from "joi";
import { Request, Response, NextFunction } from "express";
export declare const validateRequest: (sourceProperty: keyof Request, schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
