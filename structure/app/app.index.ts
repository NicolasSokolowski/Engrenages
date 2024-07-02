import express, { json } from "express";

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

export { app };