const mongoose = require("mongoose");

let mockSchema = new mongoose.Schema({
  prop1: String,
  prop2: String,
  prop3: String,
});

let mockModel = mongoose.model("Mock", mockSchema);

module.exports = mockModel;
