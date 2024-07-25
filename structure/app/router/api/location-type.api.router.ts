import express from "express";
import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import { locationTypeController } from "../../controllers/index.controllers";
import specificLocationTypeRouter from "./specificLocationType.api.router";

const locationTypeRouter = express.Router();

locationTypeRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.create)    
  );

locationTypeRouter.use("/:id", specificLocationTypeRouter);

export default locationTypeRouter;