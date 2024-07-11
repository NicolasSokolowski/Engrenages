import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { blockageController } from "../../controllers/index.controller";
import { blockageCreateSchema } from "../../validation/index.shemas";

const blockageSpecificRouter = express.Router({ mergeParams: true });

blockageSpecificRouter.route("/")
  .get(
    controllerWrapper(blockageController.getByPk)
  )
  .patch(
    validateRequest("body", blockageCreateSchema),
    controllerWrapper(blockageController.update)
  )
  .delete(
    controllerWrapper(blockageController.delete)
  );

export default blockageSpecificRouter;