import express from "express";
import { controllerWrapper } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controller";
import { productUpdateSchema } from "../../validation/schemas/product.index.schema";
import { validateRequest } from "@zencorp/engrenages";

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