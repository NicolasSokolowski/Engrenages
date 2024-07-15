import { errorCatcher } from "@zencorp/engrenages";
import express from "express";
import { authController } from "../../controllers/index.controllers";
import currentUserRouter from "./currentUser.router";

const authRouter = express.Router();

authRouter.route("/signin")
  .post(
    errorCatcher(authController.signin)
  );

authRouter.use("/currentuser", currentUserRouter);

export default authRouter;