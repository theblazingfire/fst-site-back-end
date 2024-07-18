const config = require("./config");

function welcome(name) {
  return `
    <html>
      <body style="background-color: #000; color: #fff; font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #fff;">Welcome to ${config.companyName}</h1>
        <p>Hello ${name},</p>
        <p>Welcome to our site. We are excited to have you with us.</p>
      </body>
    </html>
  `;
}

function verify(name, userId, verifyToken) {
  const verifyLink = `${
    config.productionAddress || `http://${config.host}:${config.port}`
  }/auth/verify?user=${userId}&token=${verifyToken}`;
  return `
    <html>
      <body style="background-color: #000; color: #fff; font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #fff;">Verify Your Email</h1>
        <p>Hello ${name},</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}" style="color: #4CAF50;">Verify Email</a>
      </body>
    </html>
  `;
}

function passwordReset(name, resetToken) {
  let frontEndLocalAddr = "http://localhost:3000";
  const resetLink = `${
    config.frontendProductionAddr || frontEndLocalAddr
  }/passwordReset?resetToken=${resetToken}`;
  return `
    <html>
      <body style="background-color: #333; color: #fff; padding: 20px;">
        <h1>Password Reset</h1>
        <p>Hello ${name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color: #4CAF50;">Reset Password</a>
      </body>
    </html>
  `;
}

module.exports = {
  welcome,
  verify,
  passwordReset,
};
