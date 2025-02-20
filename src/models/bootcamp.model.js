const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bootCampSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

const BootCampModel = mongoose.model("Bootcamp", bootCampSchema);

module.exports = BootCampModel;
