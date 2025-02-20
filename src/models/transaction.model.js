const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    paymentID: {
      type: String,
      default: "",
    },
    for: {
      type: String,
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    paid: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "bank_transfer", "paypal", "crypto", "other"],
      required: true,
      default: "other",
    },
  },
  { timestamps: true },
);

const TransactionModel = mongoose.model("Transactions", TransactionSchema);

module.exports = TransactionModel;
