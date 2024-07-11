import { controllerWrapper } from "@zencorp/engrenages";
import express from "express";
import { blockageController } from "../../controllers/index.controller";

const blockageSpecificRouter = express.Router({ mergeParams: true });

blockageSpecificRouter.route("/")
  .get(
    controllerWrapper(blockageController.getByPk)
  )
  .patch(
    controllerWrapper(blockageController.update)
  )
  .delete(
    controllerWrapper(blockageController.delete)
  );

export default blockageSpecificRouter;