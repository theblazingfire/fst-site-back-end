const mongoose = require("mongoose");
const logger = require("./logger");
async function connectDB(DB) {
  try {
    await mongoose.connect(DB);
  } catch (err) {
    logger.errorLogger(err);
    throw err;
  }
}
module.exports = connectDB;
