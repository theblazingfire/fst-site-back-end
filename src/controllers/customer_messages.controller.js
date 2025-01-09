const CustomerMessage = require("../models/customer_messages.model");
const { transporter, mailOptions } = require("../functions/nodemailer.config");
const emailTemplates = require("../utils/emailTemplates");
const validator = require("validator");

// Endpoint to handle incoming customer messages
const postCustomerMessage = async (req, res) => {
  const { email, message } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Save the customer message to the database
    const newMessage = new CustomerMessage({
      email,
      message,
      created: new Date().toISOString(),
      replied: false,
    });

    await newMessage.save();

    // Return success response
    return res.status(201).json({ message: "Message received successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all blog posts
const getCustomerMessages = async (req, res) => {
  const { replied, startDate, endDate } = req.query;

  // Validate dates
  if (startDate && !validator.isISO8601(startDate)) {
    return res.status(400).json({ message: "Invalid startDate format" });
  }
  if (endDate && !validator.isISO8601(endDate)) {
    return res.status(400).json({ message: "Invalid endDate format" });
  }

  try {
    const query = {};

    if (replied !== undefined) {
      // Convert replied to boolean
      const isReplied = replied === "true";
      query.replied = isReplied;
    }

    if (startDate || endDate) {
      query.created = {};

      if (startDate) {
        query.created.$gte = new Date(startDate);
      }

      if (endDate) {
        query.created.$lte = new Date(endDate);
      }
    }

    const messages = await CustomerMessage.find(query);

    // Return success response
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Endpoint to handle admin reply to customer message
const replyToCustomerMessage = async (req, res) => {
  const { messageId } = req.params;
  const { replyMessage } = req.body;
  console.log("replying", replyMessage);

  try {
    // Find the customer message by ID
    const customerMessage = await CustomerMessage.findById(messageId);
    if (!customerMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Send the reply via email
    const replyEmailOptions = {
      ...mailOptions,
      to: customerMessage.email,
      subject: "Your message has been replied",
      html: emailTemplates.reply(customerMessage.email, replyMessage),
    };

    await transporter.sendMail(replyEmailOptions);

    // Update the message as replied
    customerMessage.replied = true;
    await customerMessage.save();

    // Return success response
    return res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postCustomerMessage,
  replyToCustomerMessage,
  getCustomerMessages,
};
