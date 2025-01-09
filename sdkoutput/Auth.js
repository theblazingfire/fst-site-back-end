// Auth

export const Auth = {
  /**
   * User Signup
   * Tags: Auth
   * Method: POST
   * Path: /auth/signup/emailandpassword
   * Responses: 201, 400, 409
   */

  postAuthSignupEmailandpassword: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/auth/signup/emailandpassword`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postAuthSignupEmailandpassword:", error);
      throw error;
    }
  },

  /**
   * User Login
   * Tags: Auth
   * Method: POST
   * Path: /auth/login
   * Responses: 200, 400, 401
   */

  postAuthLogin: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/auth/login`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postAuthLogin:", error);
      throw error;
    }
  },

  /**
   * Forgot Password
   * Tags: Auth
   * Method: POST
   * Path: /auth/forgot-password
   * Responses: 200, 400, 404
   */

  postAuthForgotpassword: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/auth/forgot-password`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postAuthForgotpassword:", error);
      throw error;
    }
  },

  /**
   * Reset Password
   * Tags: Auth
   * Method: POST
   * Path: /auth/reset-password
   * Responses: 200, 400, 401
   */

  postAuthResetpassword: async (params = {}, data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/auth/reset-password`,
        params,
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postAuthResetpassword:", error);
      throw error;
    }
  },

  /**
   * Update User Details
   * Tags: Auth
   * Method: PUT
   * Path: /auth/update
   * Responses: 200, 400, 401
   */

  putAuthUpdate: async (data = {}) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/auth/update`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in putAuthUpdate:", error);
      throw error;
    }
  },

  /**
   * Disable Account
   * Tags: Auth
   * Method: PUT
   * Path: /auth/disable
   * Responses: 200, 401
   */

  putAuthDisable: async () => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/auth/disable`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in putAuthDisable:", error);
      throw error;
    }
  },

  /**
   * Delete Account
   * Tags: Auth
   * Method: DELETE
   * Path: /auth/delete
   * Responses: 200, 401
   */

  deleteAuthDelete: async () => {
    try {
      const response = await axios({
        method: "delete",
        url: `/api/auth/delete`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteAuthDelete:", error);
      throw error;
    }
  },

  /**
   * Check if token is valid
   * Tags: Auth
   * Method: GET
   * Path: /auth/is-valid
   * Responses: 200, 401, 403, 404, 500
   */

  getAuthIsvalid: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/auth/is-valid`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getAuthIsvalid:", error);
      throw error;
    }
  },

  /**
   * Resend verification email
   * Tags: Auth
   * Method: POST
   * Path: /resend-verification-email
   * Responses: 200, 400, 404, 500
   */

  postResendverificationemail: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/resend-verification-email`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postResendverificationemail:", error);
      throw error;
    }
  },
};
