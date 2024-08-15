import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { productBlockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas"
import specificBlockageRouter from "./specificBlockage.router";

const ProductBlockageRouter = express.Router();

ProductBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", blockageCreateSchema),
    errorCatcher(productBlockageController.requestCreation)
  );

ProductBlockageRouter.use("/:id", specificBlockageRouter);

export default ProductBlockageRouter;