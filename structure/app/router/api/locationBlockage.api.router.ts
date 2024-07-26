import express from "express";
import { locationBlockageController } from "../../controllers/index.controllers";
import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import specificLocationBlockageRouter from "./specificLocationBlockage.api.router";

const locationBlockageRouter = express.Router();

locationBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.create)
  );

locationBlockageRouter.use("/:id", specificLocationBlockageRouter);

export default locationBlockageRouter;