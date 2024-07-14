import { checkPermissions, controllerWrapper, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { userController } from "../../controllers/index.controllers";
import { passwordUpdateSchema } from "../../validation/index.schemas";

const updatePasswordRouter = express.Router({ mergeParams: true });

updatePasswordRouter.route("/")
  .patch(
    requireAuth,
    checkPermissions(["operator", "admin"]),
    validateRequest("body", passwordUpdateSchema),
    controllerWrapper(userController.updatePassword)
  );

export default updatePasswordRouter;