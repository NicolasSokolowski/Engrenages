import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controllers";
import { productCreateSchema } from "../../validation/index.shemas";
import blockageRouter from "./blockage.router";
import specificProductRouter from "./specificProduct.router";

const productRouter = express.Router();

productRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(productController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    validateRequest("body", productCreateSchema),
    errorCatcher(productController.create)
  );

productRouter.use("/blockage", blockageRouter);
productRouter.use("/:id", specificProductRouter);

export default productRouter;