import express from "express";
import { controllerWrapper } from "@zencorp/engrenages";
import blockageSpecificRouter from "./blockageSpecific.router";
import { blockageController } from "../../controllers/index.controller";

const blockageRouter = express.Router();

blockageRouter.route("/")
  .get(
    controllerWrapper(blockageController.getAll)
  )
  .post(
    controllerWrapper(blockageController.create)
  );

blockageRouter.use("/:id", blockageSpecificRouter);

export default blockageRouter;