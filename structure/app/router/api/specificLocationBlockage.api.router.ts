import { checkPermissions, errorCatcher, requireAuth } from "@zencorp/engrenages";
import express from "express";
import { locationBlockageController } from "../../controllers/index.controllers";

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
    errorCatcher(locationBlockageController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(locationBlockageController.delete)
  );

export default specificLocationBlockageRouter;