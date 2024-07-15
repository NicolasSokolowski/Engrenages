import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { userController } from "../../controllers/index.controllers";
import { userCreateSchema } from "../../validation/index.schemas";
import roleRouter from "./role.router";
import specificUserRouter from "./specificUser.router";

const userRouter = express.Router();

userRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(userController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", userCreateSchema),
    errorCatcher(userController.createUser)
  );

userRouter.use("/role", roleRouter);
userRouter.use("/:id", specificUserRouter);

export default userRouter;