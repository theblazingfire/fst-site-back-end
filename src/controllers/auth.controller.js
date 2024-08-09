const Auth = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const config = require("../utils/config");
const { transporter, mailOptions } = require("../functions/nodemailer.config");
const emailTemplates = require("../utils/emailTemplates");
const generateRandomString = require("../utils/randomString");
const logger = require("../utils/logger");

const signupWithEmailAndPassword = async (req, res) => {
  const { email, password, recoveryEmail, role } = req.body;
  let acceptableRole = ["user", "admin"];
  let roleValid = acceptableRole.includes(role);
  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate email
  if (!roleValid) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Validate password length
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Check if email already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    } else if (role == "admin" && !config.adminMails.includes(email)) {
      return res
        .status(403)
        .json({
          error: "Forbidden",
          message: "You are not allowed to signup as an admin",
        });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Generate verification token string
    const verifyTokenString = generateRandomString(32);
    const verifyToken = jwt.sign(
      { email, verifyTokenString },
      config.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Create new user
    const newUser = new Auth({
      email,
      recoveryEmail,
      hash,
      verifyTokenString,
      role,
    });

    await newUser.save();

    // Generate JWT token for session
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      config.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Send welcome email
    const welcomeEmailOptions = {
      ...mailOptions,
      to: email,
      subject: "Welcome to " + config.companyName,
      html: emailTemplates.welcome(email),
    };
    await transporter.sendMail(welcomeEmailOptions);

    // Send verification email
    const verifyEmailOptions = {
      ...mailOptions,
      to: email,
      subject: "Verify your email",
      html: emailTemplates.verify(email, newUser._id, verifyToken),
    };
    await transporter.sendMail(verifyEmailOptions);

    // Return the token
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  let acceptableRole = ["user", "admin"];
  let roleValid = acceptableRole.includes(role);
  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate email
  if (!roleValid) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if the user exists
    const authUser = await Auth.findOne({ email });
    if (!authUser) {
      logger.errorLogger("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the account is disabled or deleted
    if (authUser.deleted) {
      logger.errorLogger("Account is deleted");
      return res.status(403).json({ message: "Account has been deleted" });
    }
    // Check if the account is disabled or deleted
    if (authUser.disabled || authUser.deleted) {
      logger.errorLogger("Account is disabled");
      return res.status(403).json({ message: "Account has been disabled" });
    }

    if (authUser.role !== role) {
      logger.errorLogger("Role Mismatch. Forbidden Login");
      return res
        .status(403)
        .json({
          message:
            "Role Missmatch. You should sign up with the appropriate role.",
        });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, authUser.hash);
    if (!isMatch) {
      logger.errorLogger("Invalid email or password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: authUser._id, email: authUser.email, role: authUser.role },
      config.JWT_SECRET,
      { expiresIn: "24h" }, // Token expires in 1 hour
    );
    return res.status(200).json({ token });
  } catch (error) {
    logger.errorLogger(error.message);
    logger.errorLogger(error);
    return res.status(500).json({ message: "Server error" });
  }
}

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if user exists
    const existingUser = await Auth.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (existingUser.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token string
    const verifyTokenString = generateRandomString(32);
    const verifyToken = jwt.sign(
      { email, verifyTokenString },
      config.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Update user's verifyTokenString
    existingUser.verifyTokenString = verifyTokenString;
    await existingUser.save();

    // Send verification email
    const verifyEmailOptions = {
      ...mailOptions,
      to: email,
      subject: "Verify your email",
      html: emailTemplates.verify(email, existingUser._id, verifyToken),
    };
    await transporter.sendMail(verifyEmailOptions);

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { user, token } = req.query;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const authUser = await Auth.findById(user);
    if (!authUser) {
      return res.status(400).json({ message: "Invalid user" });
    }
    logger.infoLogger(decoded);
    logger.infoLogger(authUser);

    if (authUser.verifyTokenString !== decoded.verifyTokenString) {
      return res.status(400).json({ message: "Invalid token" });
    }

    authUser.verified = true;
    authUser.verifyTokenString = "";
    await authUser.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.errorLogger("Token has expired");
      return res.status(400).json({ message: "Token has expired" });
    }
    logger.errorLogger(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserDetails = async (req, res) => {
  const { email, password, recoveryEmail } = req.body;
  const userId = req.user.userId;

  try {
    // Find the user by ID
    const authUser = await Auth.findById(userId);
    if (!authUser) {
      logger.errorLogger("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Update email if provided
    if (email) {
      if(!validator.isEmail(email)){
        return res.status(400).json("Invalid email format")
      }
      // Check if the new email is already registered
      const existingUser = await Auth.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        logger.errorLogger("Email is already registered");
        return res.status(400).json({ message: "Email is already registered" });
      }
      authUser.email = email;
    }

    // Update password if provided
    if (password) {
      if (password.length < 8) {
        logger.errorLogger("Password must be at least 8 characters long");
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      authUser.hash = await bcrypt.hash(password, salt);
    }

    // Update recovery email if provided
    if (recoveryEmail) {
      if(!validator.isEmail(recoveryEmail)){
        return res.status(400).json("Invalid email format")
      }
      authUser.recoveryEmail = recoveryEmail;
    }

    // Save the updated user document
    await authUser.save();

    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    logger.errorLogger(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteAccount = async (req, res) => {
  let { email }= req.query

  if(!(req.user.email == email || req.user.role == 'admin')){
    return res.status(403).json({message: 'you are not permitted to delete this account.'})
  }

  try {
    // Find and delete the user account
    const deletedUser = await Auth.find({email});
    
    if (!deletedUser) {
      logger.errorLogger("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    deletedUser.deleted = true
    await deletedUser.save()

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.errorLogger(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Disable user account
const disableAccount = async (req, res) => {
  let {email}=req.body

  if(!(req.user.email == email || req.user.role == 'admin')){
    return res.status(403).json({message: 'You are not permitted to disable this account.'})
  }

  try {
    // Find the user account and update the disabled flag
    let user = await Auth.find({email})

    if (!user) {
      logger.errorLogger("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    
    user.disabled = true;
    await user.save()
    return res.status(200).json({ message: "Account disabled successfully" });
  } catch (error) {
    logger.errorLogger(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      logger.errorLogger("Email not registered");
      return res.status(404).json({ message: "Email not registered" });
    }
    let resetTokenString = generateRandomString(10);
    const resetToken = jwt.sign(
      { userId: user._id, resetTokenString },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    user.resetTokenString = resetTokenString;
    await user.save();

    const mailOptionsWithReset = {
      ...mailOptions,
      to: user.email,
      subject: "Password Reset",
      html: emailTemplates.passwordReset(user.email, resetToken, user.role),
    };

    transporter.sendMail(mailOptionsWithReset, (error, info) => {
      logger.infoLogger(info);
      if (error) {
        logger.errorLogger(error.message);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    logger.errorLogger(error.message);
    logger.errorLogger(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.query;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, config.JWT_SECRET);
    const user = await Auth.findById(decoded.userId);
    if (!user || user.resetTokenString !== decoded.resetTokenString) {
      logger.errorLogger("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.hash = await bcrypt.hash(newPassword, 10); // Ensure to import bcrypt
    user.resetTokenString = "";
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.errorLogger(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const tokenIsValid = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      res.status(200).json({ isValid: true });
    });
  } catch (error) {
    console.error({ error });
    logger.errorLogger("Error: Is invalid");
    logger.errorLogger(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signupWithEmailAndPassword,
  verifyEmail,
  login,
  updateUserDetails,
  deleteAccount,
  disableAccount,
  forgotPassword,
  resetPassword,
  tokenIsValid,
  resendVerificationEmail,
};
