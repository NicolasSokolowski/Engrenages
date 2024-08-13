import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { locationTypeController } from "../../controllers/index.controllers";
import { typeUpdateSchema } from "../../validation/index.schemas";

const specificLocationTypeRouter = express.Router({ mergeParams: true });

specificLocationTypeRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.getByPk)    
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", typeUpdateSchema),
    errorCatcher(locationTypeController.requestUpdate)    
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.requestDeletion)    
  );

export default specificLocationTypeRouter;