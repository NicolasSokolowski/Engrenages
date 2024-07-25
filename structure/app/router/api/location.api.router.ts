import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import express from "express";
import locationTypeRouter from "./location-type.api.router";

const locationRouter = express.Router();

locationRouter.route("/")
  // .get(
  //   errorCatcher(requireAuth),
  //   errorCatcher(checkPermissions(["admin"])),
  //   errorCatcher(locationController.getAll)
  // )
  .post((req, res, next) => {});

locationRouter.use("/type", locationTypeRouter);
// locationRouter.use("/blockage", locationBlockageRouter)
// locationRouter.use("/:id", specificLocationRouter);

export default locationRouter;
