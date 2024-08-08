const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerMessageSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [validateEmail, 'Invalid email format'],
  },
  message: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  replied: {
    type: Boolean,
    default: false,
  },
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const CustomerMessage = mongoose.model('CustomerMessage', customerMessageSchema);
module.exports = CustomerMessage;
