// Profile

import axios from "axios";
interface ProfileApi {
  postProfile: (token: any) => Promise<any>;
  getProfile: (token: any, page: any) => Promise<any>;
  getProfileSearch: (token: any, username: any, email: any) => Promise<any>;
  getProfileByUserId: (token: any, userId: any) => Promise<any>;
  putProfileByUserId: (
    token: any,
    userId: any,
    username: any,
    email: any,
    profileImage: any,
  ) => Promise<any>;
  deleteProfileByUserId: (token: any, userId: any) => Promise<any>;
  postProfileByUserIdUpload: (
    token: any,
    userId: any,
    files: any,
  ) => Promise<any>;
}
export const Profile: ProfileApi = {
  /**
   * Create a new profile
   * Tags: Profile
   * Method: POST
   * Path: /profile
   * Responses: 201, 400, 500
   */

  postProfile: async (token) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }

    let config = {
      url: `http://localhost:8080/profile`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {},
    };

    try {
      const response = await axios(config);
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

  getProfile: async (token, page) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof page !== "number") {
      throw new Error("Argument 'page' should be of type integer ");
    }

    let config = {
      url: `http://localhost:8080/profile?page=${encodeURIComponent(page)}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
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

  getProfileSearch: async (token, username, email) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof username !== "string") {
      throw new Error("Argument 'username' should be of type string ");
    }
    if (typeof email !== "string") {
      throw new Error("Argument 'email' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/profile/search?username=${encodeURIComponent(
        username,
      )}&email=${encodeURIComponent(email)}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
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

  getProfileByUserId: async (token, userId) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof userId !== "string") {
      throw new Error("Argument 'userId' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/profile/${userId}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
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

  putProfileByUserId: async (token, userId, username, email, profileImage) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof userId !== "string") {
      throw new Error("Argument 'userId' should be of type string ");
    }
    if (typeof username !== "string") {
      throw new Error("Argument 'username' should be of type string ");
    }
    if (typeof email !== "string") {
      throw new Error("Argument 'email' should be of type string ");
    }
    if (typeof profileImage !== "string") {
      throw new Error("Argument 'profileImage' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/profile/${userId}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        username: `${username}`,
        email: `${email}`,
        profileImage: `${profileImage}`,
      },
    };

    try {
      const response = await axios(config);
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

  deleteProfileByUserId: async (token, userId) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof userId !== "string") {
      throw new Error("Argument 'userId' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/profile/${userId}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
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

  postProfileByUserIdUpload: async (token, userId, files) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof userId !== "string") {
      throw new Error("Argument 'userId' should be of type string ");
    }
    if (!Array.isArray(files) && !files.every((item) => item instanceof File)) {
      throw new Error(
        "Argument 'files' should be of type array and the items should be of the type in the {'type':'array','items':{'type':'string','format':'binary'}} format",
      );
    }

    let formData = new FormData();
    files.forEach((x) => {
      formData.append("files", x); // Add each file to the "files" key
    });

    let config = {
      url: `http://localhost:8080/profile/${userId}/upload`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in postProfileByUserIdUpload:", error);
      throw error;
    }
  },
};
