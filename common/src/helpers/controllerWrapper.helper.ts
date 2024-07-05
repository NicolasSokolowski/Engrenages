import { Request, Response, NextFunction } from 'express';

const controllerWrapper = (controller: (req: Request, res: Response, next: NextFunction) => Promise<void>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    next(err);
  }
};

export default controllerWrapper;
