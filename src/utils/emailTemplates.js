const config = require("./config");


function welcome(name) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
      <style>
        .w-max-content {
          width: max-content
        }
        body {
          color: #264f03;
        }
        .logo {
          width: 50px;
        }
        .heading-banner {
          background-image: linear-gradient(-196deg, #2d7004, #79c500);
          color: white !important;
          border-radius: 15px;
        }
        h1,h2,h3,h4,h5,h6 {
          color: #176917;
        }
        .heading-banner h1,.heading-banner h2,.heading-banner h3,.heading-banner h4,.heading-banner h5,.heading-banner h6{
          color: white;
        }
    .button-1 {
      background-color: #141612;
      color: white;
      border: 0px solid;
      border-radius: 6px;
      padding: 7px 30px;
    }
    .p-space{
      padding: 8px 0px;
    }

      </style>
    </head>
    <body>
      <div class="email-container m-2">
        <div class="py-2"></div>
        <h1>Hi ${name},Welcome to ${config.companyName}!</h1>
        <p>We're thrilled to have you on board. Let's serve you with the best inclass cullinary artistry in Nigeria.</p>
        <p>A Verification email would be sent to you shortly. Kindly verify your email so that you can be able to continue using the site.</p>
        <div class="p-space"></div>
        <small><i>For support, contact us via</i> <br>Company Mail: ${config.companySupportMail} <br> Call: ${config.companyCallLine} </small>
      </div>
    </body>
    </html>`;
}

function verify(name, userId, verifyToken) {
  const verifyLink = `${
    config.productionAddress || `http://${config.host}:${config.port}`
  }/auth/verify?user=${userId}&token=${verifyToken}`;
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
  <style>
    .w-max-content {
      width: max-content
    }
    body{
      color: #264f03;
    }
    .logo {
      width: 50px;
    }
    .heading-banner {
      background-image: linear-gradient(-196deg, #2d7004, #79c500);
      color: white !important;
      border-radius: 15px;
    }
    h1,h2,h3,h4,h5,h6 {
      color: #176917;
    }
    .heading-banner h1,.heading-banner h2,.heading-banner h3,.heading-banner h4,.heading-banner h5,.heading-banner h6{
      color: white;
    }
    .button-1 {
      background-color: #141612;
      color: white;
      border: 0px solid;
      border-radius: 6px;
      padding: 7px 30px;
    }
    .p-space{
      padding: 8px 0px;
    }
  </style>
</head>
<body>
  <div class="email-container p-2">
    <div class="py-2"></div>
    <h1>Verify Your Email</h1>
    <p>Hi ${name}, Please click the button below to verify your email address. If you didn't sign up for the account, kindly ignore this email.</p>
    <a href="${verifyLink}" class="button-1">Verify Email</a>
    <div class="p-space"></div>
      <small><i>For support, contact us via</i> <br>Company Mail: ${config.companySupportMail} <br> Call: ${config.companyCallLine} </small>
  </div>
</body>
</html>
  `;
}

function passwordReset(name, resetToken, role) {
  let frontEndAddr;
  if(role == 'admin'){
    frontEndAddr = "https://joegreen-admin.netlify.app"
  }
  else {
    frontEndAddr = "https://joegreencafe.com"
  }
  const resetLink = `${
    frontEndAddr
  }/reset-password?resetToken=${resetToken}`;
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"><style>
    .w-max-content {
      width: max-content
    }
    body{
      color: #264f03;
    }
    .logo {
      width: 50px;
    }
    .heading-banner {
      background-image: linear-gradient(-196deg, #2d7004, #79c500);
      color: white !important;
      border-radius: 15px;
    }
    h1,h2,h3,h4,h5,h6 {
      color: #176917;
    }
    .heading-banner h1,.heading-banner h2,.heading-banner h3,.heading-banner h4,.heading-banner h5,.heading-banner h6{
      color: white;
    }
    .button-1 {
      background-color: #141612;
      color: white;
      border: 0px solid;
      border-radius: 6px;
      padding: 7px 30px;
    }
    .p-space{
      padding: 8px 0px;
    }

  </style>
</head>
<body>
  <div class="email-container p-2">
    <h5>Hello ${name},</h5>
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}" class="button-1">Reset Password</a>
    <div class="p-space"></div>
      <small><i>For support, contact us via</i> <br>Company Mail: ${config.companySupportMail} <br> Call: ${config.companyCallLine} </small>
  </div>
  </div>
</body>
</html>
  `;
}

module.exports = {
  welcome,
  verify,
  passwordReset,
};
