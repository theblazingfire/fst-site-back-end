const express = require("express");
const {
  createTransaction,
  updateTransaction,
  getTransactionByID,
  getTransactions,
  deleteTransaction,
} = require("../controllers/transactions.controller");
const verifyToken = require("../functions/verifyToken.middleware");

const transactionRouter = express.Router();

transactionRouter.post("/", verifyToken, createTransaction);
transactionRouter.put("/:id", verifyToken, updateTransaction);
transactionRouter.get("/", verifyToken, getTransactions);
transactionRouter.get("/:id", verifyToken, getTransactionByID);
transactionRouter.delete("/:id", verifyToken, deleteTransaction);

module.exports = transactionRouter;
