const Profile = require('../models/profile.model');
const logger = require('../utils/logger');
const saveToCloudinary = require('../functions/saveToCloudinary');

// Create a new profile
const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, dateOfBirth, bio, location, website } = req.body;
    const newProfile = new Profile({
      user: req.user.id,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      bio,
      location,
      website,
    });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    logger.errorLogger('Error creating profile', true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: 'Error creating profile', error });
  }
};

// Get profile by user ID
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    logger.errorLogger('Error getting profile', true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: 'Error getting profile', error });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { ...req.body },
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    logger.errorLogger('Error updating profile', true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedProfile = await Profile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    logger.errorLogger('Error deleting profile', true);
    logger.errorLogger(error, true);
    res.status(500).json({ message: 'Error deleting profile', error });
  }
};
// Upload and update profile image
const uploadProfileImage = async (req, res) => {
    try {
      const { userId } = req.params;
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      const uploadedImageUrls = await saveToCloudinary(files, 'profile_images');
      const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { profileImage: uploadedImageUrls[0] },
        { new: true }
      );
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json(profile);
    } catch (error) {
      logger.errorLogger('Error uploading profile image', true);
      logger.errorLogger(error, true);
      res.status(500).json({ message: 'Error uploading profile image', error });
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
      logger.errorLogger.error('Error fetching profiles:', error);
      res.status(500).json({ error: 'Error fetching profiles' });
    }
  };
  
  // Search profiles based on queries
  const searchProfiles = async (req, res) => {
    try {
      const query = req.query;
      const profiles = await Profile.find(query);
  
      res.status(200).json(profiles);
    } catch (error) {
      logger.errorLogger.error('Error searching profiles:', error);
      res.status(500).json({ error: 'Error searching profiles' });
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
