import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controller";
import { productCreateSchema } from "../../validation/index.shemas";
import productSpecificRouter from "./productSpecific.router";
import blockageRouter from "./blockage.router";

const productRouter = express.Router();

productRouter.route("/")
  .get(
    controllerWrapper(productController.getAll)
  )
  .post(
    validateRequest("body", productCreateSchema),
    controllerWrapper(productController.create)
  );

productRouter.use("/blockage", blockageRouter);
productRouter.use("/:id", productSpecificRouter);

export default productRouter;