import express from "express";

const structureRouter = express.Router();

structureRouter.route("/")
  .get((req, res, next) => {})
  .post((req, res, next) => {});

structureRouter.route("/:empID")
  .patch((req, res, next) => {})
  .delete((req, res, next) => {});

export default structureRouter;
