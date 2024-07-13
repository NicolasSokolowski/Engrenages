import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controllers";
import { productUpdateSchema } from "../../validation/index.shemas";

const specificProductRouter = express.Router({ mergeParams: true });

specificProductRouter.route("/")
  .get(
    controllerWrapper(productController.getByPk)
  )
  .patch(
    validateRequest("body", productUpdateSchema),
    controllerWrapper(productController.update)
  )
  .delete(
    controllerWrapper(productController.delete)
  );

export default specificProductRouter;