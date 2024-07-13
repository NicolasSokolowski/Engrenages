import { controllerWrapper, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { userController } from "../../controllers/index.controllers";
import { userCreateSchema } from "../../validation/index.schemas";
import roleRouter from "./role.router";
import specificUserRouter from "./specificUser.router";

const userRouter = express.Router();

userRouter.route("/")
  .get(
    controllerWrapper(userController.getAll)
  )
  .post(
    validateRequest("body", userCreateSchema),
    controllerWrapper(userController.signup)
  );

userRouter.use("/role", roleRouter);
userRouter.use("/:id", specificUserRouter);

export default userRouter;