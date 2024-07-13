import express, { json } from "express";
import router from "./router/index.router";
import { errorHandler } from "@zencorp/engrenages";

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

export { app };