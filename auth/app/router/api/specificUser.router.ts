import express from "express";
import { checkPermissions, controllerWrapper, requireAuth, validateRequest } from "@zencorp/engrenages";
import { userController } from "../../controllers/index.controllers";
import { userUpdateSchema } from "../../validation/index.schemas";
import updatePasswordRouter from "./updatePassword.router";

const specificUserRouter = express.Router({ mergeParams: true });


specificUserRouter.route("/")
  .get(
    requireAuth,
    checkPermissions(["admin"]),
    controllerWrapper(userController.getByPk)
  )
  .patch(
    requireAuth,
    checkPermissions(["admin"]),
    validateRequest("body", userUpdateSchema),
    controllerWrapper(userController.update)
  )
  .delete(
    requireAuth,
    checkPermissions(["admin"]),
    controllerWrapper(userController.delete)
  );

specificUserRouter.use("/updatepassword", updatePasswordRouter);

export default specificUserRouter;