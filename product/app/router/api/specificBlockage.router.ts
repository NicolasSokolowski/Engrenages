import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { blockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas";

const specificBlockageRouter = express.Router({ mergeParams: true });

specificBlockageRouter.route("/")
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

export default specificBlockageRouter;