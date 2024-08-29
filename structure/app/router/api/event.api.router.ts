import { sseClients } from "@zencorp/engrenages";
import express, { Request, Response } from "express";

const eventsRouter = express.Router();

eventsRouter.route("/:correlationID")
  .get((req: Request, res: Response) => {
    const correlationID = req.params.correlationID;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseClients[correlationID] = res;

    req.on("close", () => {
      delete sseClients[correlationID];
      console.log(`Client déconnecté pour ${correlationID}`);
    })
  })

export default eventsRouter;