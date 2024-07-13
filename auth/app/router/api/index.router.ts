import express from "express";
import authRouter from "./auth.router";
import userRouter from "./user.router";

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;