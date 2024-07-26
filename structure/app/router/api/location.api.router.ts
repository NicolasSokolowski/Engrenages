import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import express from "express";
import locationTypeRouter from "./location-type.api.router";
import { locationController } from "../../controllers/index.controllers";
import specificLocationRouter from "./specificLocation.api.router";
import locationBlockageRouter from "./locationBlockage.api.router";

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
    errorCatcher(locationController.create)    
  );

locationRouter.use("/type", locationTypeRouter);
locationRouter.use("/blockage", locationBlockageRouter);
locationRouter.use("/:id", specificLocationRouter);

export default locationRouter;
