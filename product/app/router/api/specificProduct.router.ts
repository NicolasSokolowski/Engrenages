import express from "express";
import { checkPermissions, errorCatcher, requireAuth, validateRequest } from "@zencorp/engrenages";
import { productController } from "../../controllers/index.controllers";
import { productUpdateSchema } from "../../validation/index.shemas";

const specificProductRouter = express.Router({ mergeParams: true });

specificProductRouter.route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    validateRequest("body", productUpdateSchema),
    errorCatcher(productController.requestUpdate)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(productController.requestDeletion)
  );

export default specificProductRouter;