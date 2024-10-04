const Profile = require("../models/profile.model");
const logger = require("../utils/logger");
const saveToCloudinary = require("../functions/saveToCloudinary");

const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, dateOfBirth, bio, location, website, username } = req.body;

    // Check if the profile already exists
    const existingProfile = await Profile.findOne({ user: req.user.userId });

    if (existingProfile) {
      // Return 409 Conflict if the profile already exists
      return res.status(409).json({
        message: 'Profile already exists for this user.',
      });
    }
    console.log(req.body)
      const newProfile = new Profile({
      user: req.user.userId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      bio,
      location,
      website
    });
    if(username) newProfile.username = username
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    logger.errorLogger("Error creating profile", true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: "Error creating profile", error });
  }
};

// Get profile by user ID
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    logger.errorLogger("Error getting profile", true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: "Error getting profile", error });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;

  if(req.user.userId !== userId){
    return res.status(403).json({message: 'You are not permitted to edit this profile'})
  }
  
  try {
    // Find the profile by userId
    const updatedProfile = await Profile.findOne({ user: userId })

    // Check if profile exists
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    // Log the request body for debugging
    console.log({ body: req.body })

    // Update the profile fields with the data from request body
    Object.keys(req.body).forEach((key) => {
      if(req.body[key]){
      updatedProfile[key] = req.body[key]
      }
    });

    // Save the updated profile
    await updatedProfile.save();

    // Return the updated profile
    res.status(200).json(updatedProfile);
  } catch (error) {
    // Log the error for debugging
    logger.errorLogger("Error updating profile", true);
    logger.errorLogger(error, true);

    // Return a 500 status code with an error message
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// Upload and update profile image
const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const uploadedImageUrls = await saveToCloudinary(files, "profile_images");
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { profileImage: uploadedImageUrls[0] },
      { new: true },
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    logger.errorLogger("Error uploading profile image", true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: "Error uploading profile image", error });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedProfile = await Profile.findOne({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    deletedProfile.deleted = true;
    await deletedProfile.save()
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    logger.errorLogger("Error deleting profile", true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: "Error deleting profile", error });
  }
};

// Get profiles with pagination
const getProfiles = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 30;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find().skip(skip).limit(limit);
    const totalProfiles = await Profile.countDocuments();

    res.status(200).json({
      profiles,
      currentPage: page,
      totalPages: Math.ceil(totalProfiles / limit),
    });
  } catch (error) {
    logger.errorLogger("Error fetching profiles:", error);
    res.status(500).json({ error: "Error fetching profiles" });
  }
}

const searchProfiles = async (req, res) => {
    // Sanitize and process the query parameters
    let query = {};
    let { username, firstName, lastName, gender, dateOfBirth, bio, location, website } = req.query;

    // Check if each property is present in the query and apply case-insensitive search where applicable
    if (username) query.username = new RegExp(username, 'i');
    if (firstName) query.firstName = new RegExp(firstName, 'i');
    if (lastName) query.lastName = new RegExp(lastName, 'i');
    if (gender) query.gender = new RegExp(gender, 'i');
    if (dateOfBirth) query.dateOfBirth = dateOfBirth; // Assuming exact match for date
    if (bio) query.bio = new RegExp(bio, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (website) query.website = new RegExp(website, 'i');
  
    console.log({ query });
    try {
    // Find profiles based on the sanitized query
    const profiles = await Profile.find(query);

    res.status(200).json(profiles);
  } catch (error) {
    logger.errorLogger("Error searching profiles:", error);
    res.status(500).json({ error: "Error searching profiles" });
  }
};

module.exports = {
  getProfiles,
  searchProfiles,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage,
};
