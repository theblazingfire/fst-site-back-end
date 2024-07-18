import axiosInstance from "./axiosInstance";

const authService = {
  // Signup with email and password
  signupWithEmailAndPassword: async (email, password) => {
    try {
      const response = await axiosInstance.post(
        "/auth/signup/emailandpassword",
        { email, password },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Verify email
  verifyEmail: async (userId, token) => {
    try {
      const response = await axiosInstance.get(
        `/auth/verify?user=${userId}&token=${token}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Update user details
  updateUserDetails: async (token, email, password, recoveryEmail) => {
    try {
      const response = await axiosInstance.put(
        "/auth/update",
        { email, password, recoveryEmail },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Delete account
  deleteAccount: async (token) => {
    try {
      const response = await axiosInstance.delete("/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Disable account
  disableAccount: async (token) => {
    try {
      const response = await axiosInstance.put(
        "/auth/disable",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Reset password
  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password?resetToken=${resetToken}`,
        { newPassword },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  adminSignup: async (email, password) => {
    try {
      const response = await axiosInstance.post(`/auth/signup/admin`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default authService;
