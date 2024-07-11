import { controllerWrapper } from "@zencorp/engrenages";
import express from "express";

const blockageSpecificRouter = express.Router({ mergeParams: true });

blockageSpecificRouter.route("/")
  .get(
    controllerWrapper(blockageSpecificController.getByPk)
  )
  .patch(
    controllerWrapper(blockageSpecificController.update)
  )
  .delete(
    controllerWrapper(blockageSpecificController.delete)
  );

export default blockageSpecificRouter;