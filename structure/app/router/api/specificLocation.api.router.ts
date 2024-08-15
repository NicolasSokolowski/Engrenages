import express from "express";
import { locationController } from "../../controllers/index.controllers";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { locationUpdateSchema } from "../../validation/index.schemas";

const specificLocationRouter = express.Router({ mergeParams: true });

specificLocationRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationController.getByPk)    
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", locationUpdateSchema),
    errorCatcher(locationController.requestUpdate)    
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationController.delete)    
  );

export default specificLocationRouter;