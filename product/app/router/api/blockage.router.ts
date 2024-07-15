import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { blockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas"
import specificBlockageRouter from "./specificBlockage.router";

const blockageRouter = express.Router();

blockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(blockageController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    validateRequest("body", blockageCreateSchema),
    errorCatcher(blockageController.create)
  );

blockageRouter.use("/:id", specificBlockageRouter);

export default blockageRouter;