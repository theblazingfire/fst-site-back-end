require("dotenv").config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const NODE_ENV = process.env.NODE_ENV || "development";
const PROD_DB = process.env.PROD_DB;
const companyName = process.env.COMPANY_NAME;
const smtpHost = process.env.SMTP_HOST;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpUsername = process.env.SMTP_USERNAME;
const replyToMail = process.env.COMPANY_REPLYTO_MAIL;
const JWT_SECRET = process.env.JWT_SECRET;
const productionAddress = process.env.PRODUCTION_ADDRESS;
const frontendProductionAddr = process.env.FRONTEND_PRODUCTION_ADDRESS;
const cloudinaryName = process.env.CLOUDINARY_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudingaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const companyCallLine = "";
const companySupportMail = "";
const adminMails = process.env.ADMIN_MAILS.split(",");

module.exports = {
  port,
  host,
  NODE_ENV,
  PROD_DB,
  companyName,
  smtpHost,
  smtpPassword,
  smtpUsername,
  replyToMail,
  JWT_SECRET,
  productionAddress,
  frontendProductionAddr,
  cloudinaryApiKey,
  cloudingaryApiSecret,
  cloudinaryName,
  companyCallLine,
  companySupportMail,
  adminMails,
};
