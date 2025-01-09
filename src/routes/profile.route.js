const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage,
  getProfiles,
  searchProfiles,
} = require("../controllers/profile.controller");
const verifyToken = require("../functions/verifyToken.middleware");
const uploadImages = require("../functions/fileupload.middleware");
// Create a new profile
router.post("/", verifyToken, createProfile);

// Get profile by user ID
router.get("/:userId", verifyToken, getProfile);

// Update profile
router.put("/:userId", verifyToken, updateProfile);

// Delete profile
router.delete("/:userId", verifyToken, deleteProfile);

// Upload profile image
router.post("/:userId/upload", verifyToken, uploadImages, uploadProfileImage);
router.get("/", verifyToken, getProfiles);
router.get("/search", verifyToken, searchProfiles);

module.exports = router;
