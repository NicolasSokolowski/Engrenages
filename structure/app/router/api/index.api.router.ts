import express from "express";
import structureRouter from "./structure.api.router";

const apiRouter = express.Router();

apiRouter.use("/structure", structureRouter);

export default apiRouter;