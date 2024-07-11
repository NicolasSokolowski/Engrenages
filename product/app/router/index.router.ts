import express from "express";
import apiRouter from "./api/index.router";
import { routeNotFound } from "@zencorp/engrenages";

const router = express.Router();

router.use("/api", apiRouter);
router.use(routeNotFound);

export default router;