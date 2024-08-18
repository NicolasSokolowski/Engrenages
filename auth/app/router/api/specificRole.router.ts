import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { roleUpdateSchema } from "../../validation/index.schemas";
import { roleController } from "../../controllers/index.controllers";

const specificRoleRouter = express.Router({ mergeParams: true});

specificRoleRouter.use(errorCatcher(requireAuth));
specificRoleRouter.use(errorCatcher(checkPermissions(["admin"])));

specificRoleRouter.route("/")
  .get(
    errorCatcher(roleController.getByPk)
  )
  .patch(
    validateRequest("body", roleUpdateSchema),
    errorCatcher(roleController.update)
  )
  .delete(
    errorCatcher(roleController.delete)
  );

export default specificRoleRouter;