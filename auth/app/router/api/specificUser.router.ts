import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { userController } from "../../controllers/index.controllers";
import { userUpdateSchema } from "../../validation/index.schemas";
import updatePasswordRouter from "./updatePassword.router";

const specificUserRouter = express.Router({ mergeParams: true });


specificUserRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", userUpdateSchema),
    errorCatcher(userController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.delete)
  );

specificUserRouter.use("/updatepassword", updatePasswordRouter);

export default specificUserRouter;