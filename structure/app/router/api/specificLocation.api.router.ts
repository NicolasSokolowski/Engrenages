import express from "express";
import { locationController } from "../../controllers/index.controllers";
import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";

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
    errorCatcher(locationController.update)    
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationController.delete)    
  );

export default specificLocationRouter;