import express from "express";
import productRouter from "./product.api.router";

const apiRouter = express.Router();

apiRouter.use("/product", productRouter);

export default apiRouter;