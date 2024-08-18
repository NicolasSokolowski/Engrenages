import express from "express";
import { locationBlockageController } from "../../controllers/index.controllers";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import specificLocationBlockageRouter from "./specificLocationBlockage.api.router";
import { blockageCreateSchema } from "../../validation/index.schemas";

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
    validateRequest("body", blockageCreateSchema),
    errorCatcher(locationBlockageController.requestCreation)
  );

locationBlockageRouter.use("/:id", specificLocationBlockageRouter);

export default locationBlockageRouter;