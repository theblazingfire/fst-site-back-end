const nodemailer = require("nodemailer");
const config = require("../utils/config");

// Create a Nodemailer transporter using the Mailbit SMTP server details
const transporter = nodemailer.createTransport({
  host: config.smtpHost, // Replace with Mailbit SMTP server
  port: 587, // Typically, SMTP uses port 587 for TLS
  secure: false, // Set to true if using port 465, otherwise false for port 587
  auth: {
    user: config.smtpUsername, // Replace with your Mailbit email address
    pass: config.smtpPassword, // Replace with your Mailbit email password
  },
});

// Define email options
const mailOptions = {
  from: `${config.companyName} <adefuyeabayomi16@gmail.com>`, // Sender address
  to: undefined, // List of receivers
  subject: null, // Subject line
  html: undefined,
  replyTo: config.replyToMail,
};

module.exports = { transporter, mailOptions };
