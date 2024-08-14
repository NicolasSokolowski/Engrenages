import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { locationBlockageController } from "../../controllers/index.controllers";
import { blockageUpdateSchema } from "../../validation/index.schemas";

const specificLocationBlockageRouter = express.Router({ mergeParams: true });

specificLocationBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", blockageUpdateSchema),
    errorCatcher(locationBlockageController.requestUpdate)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.requestDeletion)
  );

export default specificLocationBlockageRouter;