import express from "express";
import { authController } from "../../controllers/index.controllers";
import currentUserRouter from "./currentUser.router";
import { errorCatcher } from "@zencorp/engrenages";

const authRouter = express.Router();

authRouter.route("/signin")
  .post(
    errorCatcher(authController.signin)
  );

authRouter.use("/currentuser", currentUserRouter);

export default authRouter;