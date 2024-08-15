import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { productBlockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas";

const specificBlockageRouter = express.Router({ mergeParams: true });

specificBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", blockageCreateSchema),
    errorCatcher(productBlockageController.requestUpdate)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productBlockageController.requestDeletion)
  );

export default specificBlockageRouter;