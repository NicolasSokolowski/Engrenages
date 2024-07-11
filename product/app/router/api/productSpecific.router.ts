import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controller";
import { productUpdateSchema } from "../../validation/index.shemas";

const productSpecificRouter = express.Router({ mergeParams: true });

productSpecificRouter.route("/")
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

export default productSpecificRouter;