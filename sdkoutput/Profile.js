// Profile

export const Profile = {
  /**
   * Create a new profile
   * Tags: Profile
   * Method: POST
   * Path: /profile
   * Responses: 201, 400, 500
   */

  postProfile: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/profile`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postProfile:", error);
      throw error;
    }
  },

  /**
   * Get profiles with pagination
   * Tags: Profile
   * Method: GET
   * Path: /profile
   * Responses: 200, 500
   */

  getProfile: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/profile`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getProfile:", error);
      throw error;
    }
  },

  /**
   * Search profiles based on queries
   * Tags: Profile
   * Method: GET
   * Path: /profile/search
   * Responses: 200, 500
   */

  getProfileSearch: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/profile/search`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getProfileSearch:", error);
      throw error;
    }
  },

  /**
   * Get profile by user ID
   * Tags: Profile
   * Method: GET
   * Path: /profile/{userId}
   * Responses: 200, 404, 500
   */

  getProfileByUserId: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/profile/{userId}`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getProfileByUserId:", error);
      throw error;
    }
  },

  /**
   * Update profile
   * Tags: Profile
   * Method: PUT
   * Path: /profile/{userId}
   * Responses: 200, 400, 404, 500
   */

  putProfileByUserId: async (params = {}, data = {}) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/profile/{userId}`,
        params,
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in putProfileByUserId:", error);
      throw error;
    }
  },

  /**
   * Delete profile
   * Tags: Profile
   * Method: DELETE
   * Path: /profile/{userId}
   * Responses: 200, 404, 500
   */

  deleteProfileByUserId: async (params = {}) => {
    try {
      const response = await axios({
        method: "delete",
        url: `/api/profile/{userId}`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteProfileByUserId:", error);
      throw error;
    }
  },

  /**
   * Upload profile image
   * Tags: Profile
   * Method: POST
   * Path: /profile/{userId}/upload
   * Responses: 200, 400, 500
   */

  postProfileByUserIdUpload: async (params = {}, data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/profile/{userId}/upload`,
        params,
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postProfileByUserIdUpload:", error);
      throw error;
    }
  },
};
