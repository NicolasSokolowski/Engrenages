import { errorCatcher, requireAuth } from "@zencorp/engrenages";
import express, { Request, Response, NextFunction } from "express";

const currentUserRouter = express.Router();

currentUserRouter.get("/", 
  errorCatcher(requireAuth), (req: Request, res: Response, next: NextFunction) => {
  res.send({ user: req.user });
});

export default currentUserRouter;