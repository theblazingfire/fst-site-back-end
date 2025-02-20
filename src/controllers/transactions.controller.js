const TransactionModel = require("../models/transaction.model");
const logger = require("../utils/logger");

/**
 * Create a new transaction
 */
const createTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      paymentID,
      for: purpose,
      payer,
      userEmail,
      paid,
      amount,
      paymentMethod,
    } = req.body;

    if (
      !transactionId ||
      !purpose ||
      !payer ||
      !userEmail ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = new TransactionModel({
      transactionId,
      paymentID,
      for: purpose,
      payer,
      userEmail,
      paid,
      amount,
      paymentMethod,
    });

    await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    logger.errorLogger("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a transaction
 */
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    logger.errorLogger("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a transaction by ID
 */
const getTransactionByID = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionModel.findById(id).populate("payer");

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    logger.errorLogger("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all transactions with filters and pagination
 */
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, userEmail, paymentMethod, paid } = req.query;
    const query = {};

    if (userEmail) query.userEmail = new RegExp(userEmail, "i");
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (paid) query.paid = paid;

    const transactions = await TransactionModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("payer");

    const totalTransactions = await TransactionModel.countDocuments(query);

    res.status(200).json({
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    logger.errorLogger("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a transaction
 */
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await TransactionModel.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    logger.errorLogger("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  getTransactionByID,
  getTransactions,
  deleteTransaction,
};
