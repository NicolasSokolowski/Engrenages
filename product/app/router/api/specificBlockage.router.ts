import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { blockageController } from "../../controllers/index.controllers";
import { blockageCreateSchema } from "../../validation/index.shemas";

const specificBlockageRouter = express.Router({ mergeParams: true });

specificBlockageRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(blockageController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    validateRequest("body", blockageCreateSchema),
    errorCatcher(blockageController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["operator", "admin"])),
    errorCatcher(blockageController.delete)
  );

export default specificBlockageRouter;