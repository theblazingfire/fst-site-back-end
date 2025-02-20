const TransactionModel = require("../models/transaction.model");
const axios = require("axios");

// crud operations for the transactions

const createTransactions = async (request, response) => {
  // post request
  let tData = request.body;
  let newTransaction = new TransactionModel(tData);
  try {
    let saved = await newTransaction.save();
    response
      .status(201)
      .json({ message: "Transaction initialized", transaction: saved });
  } catch (err) {
    response.status(500).json({ message: err.message, error: err });
    throw err;
  }
};

const getTransactionById = async (request, response) => {
  // get request
  let { id } = request.params;
  try {
    let transaction = await TransactionModel.findOneByID(id);
    response
      .status(200)
      .json({ message: "retrieved successfully", transaction });
  } catch (err) {
    response.status(500).json({ error: err });
  }
};

const getTransactions = async (request, response) => {
  // get request
  let { user } = request.query;
  let query = {};

  if (user) {
    query.user = user;
  }

  try {
    let transactions = await TransactionModel.find(query);
    response
      .status(200)
      .json({ message: "retrieved Successfully", transactions });
  } catch (err) {
    response.status(500).json({ error: err });
  }
};

const updateTransactions = async (request, response) => {
  // put request
  let { id } = request.params;
  let update = request.body;
  try {
    let updated = await TransactionModel.updateById(id, update);
    response.status(200).json({ updated: true, doc: updated });
  } catch (err) {
    response.status(500).json({ error: err });
  }
};

const deleteTransactionByID = async (request, response) => {
  // delete request
};

const initializePayment = async (request, response) => {
  // needed data from the user. but actually what i need is the transactionID.
  let { transactionID } = request.body;
  // fetch The transaction data from the TransactionModel
  TransactionModel.findOne({ transactionID })
    .then((t_data) => {
      axios
        .post(`https://api.paystack.co/transaction/initialize`, {
          email: t_data.userEmail,
          amount: t_data.amount.toString(),
        })
        .then((response) => {
          console.log({ paystackInitResponse: response });
        })
        .then((err) => {
          logger.errorLogger(err.message);
          logger.errorLogger(err);
          return res.status(200).json({ message: "payment-initialized" });
        });
    })
    .catch((err) => {
      logger.errorLogger(err.message);
      logger.errorLogger(err);
      return res.status(404).json({ message: "Transaction Not Found" });
    });
};

const confirmPayment = async (request, response) => {};

// after getting the transaction details, init the tranx by reaching the paystack endpoint

module.exports = {
  createTransactions,
  getTransactionById,
  getTransactions,
  updateTransactions,
  initializePayment,
  confirmPayment,
};
