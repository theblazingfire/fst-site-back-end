// Auth

import axios from "axios";
interface AuthApi {
  postAuthLogin: (email: any, password: any, role: any) => Promise<any>;
  postAuthForgotpassword: (email: any) => Promise<any>;
  postAuthResetpassword: (resetToken: any, newPassword: any) => Promise<any>;
  putAuthUpdate: (
    email: any,
    password: any,
    recoveryEmail: any,
  ) => Promise<any>;
  putAuthDisable: () => Promise<any>;
  deleteAuthDelete: () => Promise<any>;
  getAuthIsvalid: () => Promise<any>;
  postResendverificationemail: (email: any) => Promise<any>;
  postAuthSignupEmailandpassword: (
    email: any,
    password: any,
    role: any,
  ) => Promise<any>;
}
export const Auth: AuthApi = {
  /**
   * User Login
   * Tags: Auth
   * Method: POST
   * Path: /auth/login
   * Responses: 200, 400, 401
   */

  postAuthLogin: async (email, password, role) => {
    if (typeof email !== "string") {
      throw new Error(
        "Argument 'email' should be of type string in the email format",
      );
    }
    if (typeof password !== "string") {
      throw new Error("Argument 'password' should be of type string ");
    }
    if (typeof role !== "string") {
      throw new Error("Argument 'role' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/auth/login`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email: `${email}`, password: `${password}`, role: `${role}` },
    };

    try {
      const response = await axios(config);
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

  postAuthForgotpassword: async (email) => {
    if (typeof email !== "string") {
      throw new Error(
        "Argument 'email' should be of type string in the email format",
      );
    }

    let config = {
      url: `http://localhost:8080/auth/forgot-password`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email: `${email}` },
    };

    try {
      const response = await axios(config);
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

  postAuthResetpassword: async (resetToken, newPassword) => {
    if (typeof resetToken !== "string") {
      throw new Error("Argument 'resetToken' should be of type string ");
    }
    if (typeof newPassword !== "string") {
      throw new Error("Argument 'newPassword' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/auth/reset-password?resetToken=${encodeURIComponent(
        resetToken,
      )}`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { newPassword: `${newPassword}` },
    };

    try {
      const response = await axios(config);
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

  putAuthUpdate: async (email, password, recoveryEmail) => {
    if (typeof email !== "string") {
      throw new Error(
        "Argument 'email' should be of type string in the email format",
      );
    }
    if (typeof password !== "string") {
      throw new Error("Argument 'password' should be of type string ");
    }
    if (typeof recoveryEmail !== "string") {
      throw new Error(
        "Argument 'recoveryEmail' should be of type string in the email format",
      );
    }

    let config = {
      url: `http://localhost:8080/auth/update`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: `${email}`,
        password: `${password}`,
        recoveryEmail: `${recoveryEmail}`,
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `http://localhost:8080/auth/disable`,
      method: "put",
      headers: {},
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `http://localhost:8080/auth/delete`,
      method: "delete",
      headers: {},
    };

    try {
      const response = await axios(config);
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

  getAuthIsvalid: async () => {
    let config = {
      url: `http://localhost:8080/auth/is-valid`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
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

  postResendverificationemail: async (email) => {
    if (typeof email !== "string") {
      throw new Error(
        "Argument 'email' should be of type string in the email format",
      );
    }

    let config = {
      url: `http://localhost:8080/resend-verification-email`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email: `${email}` },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in postResendverificationemail:", error);
      throw error;
    }
  },

  /**
   * User Signup
   * Tags: Auth
   * Method: POST
   * Path: /auth/signup/emailandpassword
   * Responses: 201, 400, 409
   */

  postAuthSignupEmailandpassword: async (email, password, role) => {
    if (typeof email !== "string") {
      throw new Error(
        "Argument 'email' should be of type string in the email format",
      );
    }
    if (typeof password !== "string") {
      throw new Error("Argument 'password' should be of type string ");
    }
    if (typeof role !== "string") {
      throw new Error("Argument 'role' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/auth/signup/emailandpassword`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { email: `${email}`, password: `${password}`, role: `${role}` },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in postAuthSignupEmailandpassword:", error);
      throw error;
    }
  },
};
