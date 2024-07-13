import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { roleCreateSchema } from "../../validation/index.schemas";
import { roleController } from "../../controllers/index.controllers";
import specificRoleRouter from "./specificRole.router";

const roleRouter = express.Router();

roleRouter.route("/")
  .get(
    controllerWrapper(roleController.getAll)
  )
  .post(
    validateRequest("body", roleCreateSchema),
    controllerWrapper(roleController.create)    
  );

roleRouter.use("/:id", specificRoleRouter);

export default roleRouter;