import { Request, Response, NextFunction } from 'express';

export const errorCatcher = (x: (req: Request, res: Response, next: NextFunction) => Promise<void>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await x(req, res, next);
  } catch (err) {
    next(err);
  }
};
