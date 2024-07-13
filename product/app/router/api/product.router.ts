import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controllers";
import { productCreateSchema } from "../../validation/index.shemas";
import blockageRouter from "./blockage.router";
import specificProductRouter from "./specificProduct.router";

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
productRouter.use("/:id", specificProductRouter);

export default productRouter;