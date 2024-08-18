import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import locationTypeRouter from "./locationType.api.router";
import { locationController } from "../../controllers/index.controllers";
import specificLocationRouter from "./specificLocation.api.router";
import locationBlockageRouter from "./locationBlockage.api.router";
import { locationCreateSchema } from "../../validation/index.schemas";

const locationRouter = express.Router();

locationRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationCreateSchema),
    errorCatcher(locationController.requestCreation)    
  );

locationRouter.use("/type", locationTypeRouter);
locationRouter.use("/blockage", locationBlockageRouter);
locationRouter.use("/:id", specificLocationRouter);

export default locationRouter;
