const express = require("express");
const serviceOrderRouter = express.Router();
const {
  createServiceOrders,
  updateServiceOrders,
  getServiceOrdersByID,
  getServiceOrders,
  deleteServiceOrders,
} = require("../controllers/service_orders.controller");
const verifyToken = require("../functions/verifyToken.middleware");

// Create a new service order (Requires authentication)
serviceOrderRouter.post("/", verifyToken, createServiceOrders);

// Update a specific service order by ID (Requires authentication)
serviceOrderRouter.put("/:id", verifyToken, updateServiceOrders);

// Get all service orders (Public, with optional query filters)
serviceOrderRouter.get("/", getServiceOrders);

// Get a single service order by ID (Public)
serviceOrderRouter.get("/:id", getServiceOrdersByID);

// Delete a specific service order by ID (Requires authentication)
serviceOrderRouter.delete("/:id", verifyToken, deleteServiceOrders);

module.exports = serviceOrderRouter;
