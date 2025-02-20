const express = require("express");
const {
  createBootcampRegistration,
  updateBootcampRegistration,
  getBootcampRegistrationById,
  getBootcampRegistrations,
  deleteBootcampRegistration,
} = require("../controllers/bootcamps.controller");
const verifyToken = require("../functions/verifyToken.middleware");

const bootcampRouter = express.Router();

bootcampRouter.post("/", verifyToken, createBootcampRegistration);
bootcampRouter.put("/:id", verifyToken, updateBootcampRegistration);
bootcampRouter.get("/", getBootcampRegistrations);
bootcampRouter.get("/:id", getBootcampRegistrationById);
bootcampRouter.delete("/:id", verifyToken, deleteBootcampRegistration);

module.exports = bootcampRouter;
