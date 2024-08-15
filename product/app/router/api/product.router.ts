import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controllers";
import { productCreateSchema } from "../../validation/index.shemas";
import specificProductRouter from "./specificProduct.router";
import ProductBlockageRouter from "./ProductBlockage.router";

const productRouter = express.Router();

productRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productCreateSchema),
    errorCatcher(productController.create)
  );

productRouter.use("/blockage", ProductBlockageRouter);
productRouter.use("/:id", specificProductRouter);

export default productRouter;