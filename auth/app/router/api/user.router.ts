import { checkPermissions, controllerWrapper, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { userController } from "../../controllers/index.controllers";
import { userCreateSchema } from "../../validation/index.schemas";
import roleRouter from "./role.router";
import specificUserRouter from "./specificUser.router";
import { requireAuth } from "@zencorp/engrenages";

const userRouter = express.Router();

userRouter.route("/")
  .get(
    requireAuth,
    checkPermissions(["operator", "admin"]),
    controllerWrapper(userController.getAll)
  )
  .post(
    requireAuth,
    checkPermissions(["admin"]),
    validateRequest("body", userCreateSchema),
    controllerWrapper(userController.createUser)
  );

userRouter.use("/role", roleRouter);
userRouter.use("/:id", specificUserRouter);

export default userRouter;