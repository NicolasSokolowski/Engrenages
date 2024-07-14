import { checkPermissions, controllerWrapper, requireAuth, validateRequest } from "@zencorp/engrenages";
import express from "express";
import { roleUpdateSchema } from "../../validation/index.schemas";
import { roleController } from "../../controllers/index.controllers";

const specificRoleRouter = express.Router({ mergeParams: true});

specificRoleRouter.use(requireAuth);
specificRoleRouter.use(checkPermissions(["admin"]));

specificRoleRouter.route("/")
  .get(
    controllerWrapper(roleController.getByPk)
  )
  .patch(
    validateRequest("body", roleUpdateSchema),
    controllerWrapper(roleController.update)
  )
  .delete(
    controllerWrapper(roleController.delete)
  );

export default specificRoleRouter;