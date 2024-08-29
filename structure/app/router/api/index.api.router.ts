import express from "express";
import locationRouter from "./location.api.router";
import eventsRouter from "./event.api.router";

const apiRouter = express.Router();

apiRouter.use("/location", locationRouter);
apiRouter.use("/events", eventsRouter);

export default apiRouter;