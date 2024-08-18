import express from "express";
import locationRouter from "./location.api.router";

const apiRouter = express.Router();

apiRouter.use("/location", locationRouter);

export default apiRouter;