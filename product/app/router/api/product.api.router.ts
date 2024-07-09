import express from "express";
import { controllerWrapper } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controller";
import { productCreateSchema } from "../../validation/schemas/product.index.schema";
import { validateRequest } from "@zencorp/engrenages";
import productSpecificRouter from "./productSpecific.api.router";

const productRouter = express.Router();

productRouter.route("/")
  .get(
    controllerWrapper(productController.getAll)
  )
  .post(
    validateRequest("body", productCreateSchema),
    controllerWrapper(productController.create)
  );

productRouter.use("/:productID", productSpecificRouter);

export default productRouter;