import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import blockageSpecificRouter from "./blockageSpecific.router";
import { blockageController } from "../../controllers/index.controller";
import { blockageCreateSchema } from "../../validation/index.shemas"

const blockageRouter = express.Router();

blockageRouter.route("/")
  .get(
    controllerWrapper(blockageController.getAll)
  )
  .post(
    validateRequest("body", blockageCreateSchema),
    controllerWrapper(blockageController.create)
  );

blockageRouter.use("/:id", blockageSpecificRouter);

export default blockageRouter;