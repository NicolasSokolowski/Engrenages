import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import express from "express";
import { locationTypeController } from "../../controllers/index.controllers";

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
    errorCatcher(locationTypeController.update)    
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationTypeController.delete)    
  );

export default specificLocationTypeRouter;