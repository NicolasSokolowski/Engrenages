import express from "express";
import productRouter from "./product.router";

const apiRouter = express.Router();

apiRouter.use("/product", productRouter);

export default apiRouter;