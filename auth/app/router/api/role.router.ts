import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { roleCreateSchema } from "../../validation/index.schemas";
import { roleController } from "../../controllers/index.controllers";
import specificRoleRouter from "./specificRole.router";

const roleRouter = express.Router();

roleRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(roleController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", roleCreateSchema),
    errorCatcher(roleController.create)    
  );

roleRouter.use("/:id", specificRoleRouter);

export default roleRouter;