import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { userController } from "../../controllers/index.controllers";
import { passwordUpdateSchema } from "../../validation/index.schemas";

const updatePasswordRouter = express.Router({ mergeParams: true });

updatePasswordRouter.route("/")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    validateRequest("body", passwordUpdateSchema),
    errorCatcher(userController.updatePassword)
  );

export default updatePasswordRouter;