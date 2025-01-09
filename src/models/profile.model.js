const mongoose = require("mongoose");

// Function to generate a random username
const generateRandomUsername = () => {
  return `user${Math.floor(Math.random() * 100000)}`;
};

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  username: {
    type: String,
    default: generateRandomUsername,
  },
  profileImage: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other",
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
