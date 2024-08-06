const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyToken = require("../functions/verifyToken.middleware");

router.post(
  "/signup/emailandpassword",
  authController.signupWithEmailAndPassword,
);
router.post("/signup/admin", authController.signupAdmin);
router.get("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.put("/update", verifyToken, authController.updateUserDetails);
router.delete("/delete", verifyToken, authController.deleteAccount);
router.put("/disable", verifyToken, authController.disableAccount);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post('/resend-verification-email', authController.resendVerificationEmail);
router.get('/is-valid', verifyToken, authController.tokenIsValid);

module.exports = router;
