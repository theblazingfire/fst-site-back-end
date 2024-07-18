const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  recoveryEmail: { type: String },
  hash: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  verifyTokenString: { type: String },
  resetTokenString: { type: String },
  role: { type: String, default: "user", enum: ["user", "admin"] }, // Add role field
});

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
