import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { locationTypeController } from "../../controllers/index.controllers";
import specificLocationTypeRouter from "./specificLocationType.api.router";
import { typeCreateSchema } from "../../validation/index.schemas";

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
    validateRequest("body", typeCreateSchema),
    errorCatcher(locationTypeController.requestCreation)    
  );

locationTypeRouter.use("/:id", specificLocationTypeRouter);

export default locationTypeRouter;