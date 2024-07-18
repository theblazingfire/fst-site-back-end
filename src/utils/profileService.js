import axiosInstance from './axiosInstance';

const profileService = {
  // Create a new profile
  createProfile: async (profileData, token) => {
    try {
      const response = await axiosInstance.post(
        '/profile',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Get a profile by user ID
  getProfile: async (userId, token) => {
    try {
      const response = await axiosInstance.get(
        `/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update a profile
  updateProfile: async (userId, profileData, token) => {
    try {
      const response = await axiosInstance.put(
        `/profile/${userId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Upload profile image and update profile
  uploadProfileImage: async (userId, files, token) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response = await axiosInstance.post(
        `/profile/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }, 

  // Update email, password, and recovery email
  updateAccountInfo: async (updateData, token) => {
    try {
      const response = await axiosInstance.put(
        `/profile/update-account-info`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Delete account
  deleteAccount: async (token) => {
    try {
      const response = await axiosInstance.delete(
        '/profile/delete-account',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Disable account
  disableAccount: async (token) => {
    try {
      const response = await axiosInstance.put(
        '/profile/disable-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default profileService;
