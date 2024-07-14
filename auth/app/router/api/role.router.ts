import express from "express";
import { checkPermissions, controllerWrapper, requireAuth, validateRequest } from "@zencorp/engrenages";
import { roleCreateSchema } from "../../validation/index.schemas";
import { roleController } from "../../controllers/index.controllers";
import specificRoleRouter from "./specificRole.router";

const roleRouter = express.Router();

roleRouter.route("/")
  .get(
    requireAuth,
    checkPermissions(["admin"]),
    controllerWrapper(roleController.getAll)
  )
  .post(
    requireAuth,
    checkPermissions(["admin"]),
    validateRequest("body", roleCreateSchema),
    controllerWrapper(roleController.create)    
  );

roleRouter.use("/:id", specificRoleRouter);

export default roleRouter;