// functions/saveToCloudinary.js
const cloudinary = require("cloudinary").v2;
const config = require("../utils/config");

cloudinary.config({
  cloud_name: config.cloudinaryName || "",
  api_key: config.cloudinaryApiKey || "",
  api_secret: config.cloudingaryApiSecret || "",
});

const saveToCloudinary = async (files, folder = "utils") => {
  const uploadPromises = files.map((file) => {
    return cloudinary.uploader.upload(file.path, {
      folder: folder,
    });
  });
  try {
    const results = await Promise.all(uploadPromises);
    return results.map((result) => result.secure_url);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading files");
  }
};

module.exports = saveToCloudinary;
