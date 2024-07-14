import { controllerWrapper, requireAuth } from "@zencorp/engrenages";
import express from "express";
import { authController, userController } from "../../controllers/index.controllers";

const authRouter = express.Router();

authRouter.route("/signin")
  .post(
    controllerWrapper(authController.signin)
  );

authRouter.route("/signout")
  .post(
    requireAuth,
    controllerWrapper(authController.signout)
  );

export default authRouter;