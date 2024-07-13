import express from "express";
import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import { userController } from "../../controllers/index.controllers";
import { userUpdateSchema } from "../../validation/index.schemas";
import updatePasswordRouter from "./updatePassword.router";

const specificUserRouter = express.Router({ mergeParams: true });

specificUserRouter.route("/")
  .get(
    controllerWrapper(userController.getByPk)
  )
  .patch(
    validateRequest("body", userUpdateSchema),
    controllerWrapper(userController.update)
  )
  .delete(
    controllerWrapper(userController.delete)
  );

specificUserRouter.use("/updatepassword", updatePasswordRouter);

export default specificUserRouter;