const PaystackRouter = require("express").Router();
const verifyToken = require("../functions/verifyToken.middleware");
const {
  createTransactions,
  getTransactionById,
  getTransactions,
  updateTransactions,
  confirmPayment,
  initializePayment,
} = require("../controllers/paystack.payment.controller");

PaystackRouter.post("/", verifyToken, createTransactions);

PaystackRouter.get("/", getTransactions);

PaystackRouter.get("/:id", getTransactionById);

PaystackRouter.put("/", updateTransactions);

PaystackRouter.post("/initializePayment", initializePayment);

PaystackRouter.post("/confirmPayment/:tid", confirmPayment);

module.exports = PaystackRouter;
