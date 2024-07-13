import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { blockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas"
import specificBlockageRouter from "./specificBlockage.router";

const blockageRouter = express.Router();

blockageRouter.route("/")
  .get(
    controllerWrapper(blockageController.getAll)
  )
  .post(
    validateRequest("body", blockageCreateSchema),
    controllerWrapper(blockageController.create)
  );

blockageRouter.use("/:id", specificBlockageRouter);

export default blockageRouter;