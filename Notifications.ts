// Notifications

import axios from "axios";
interface NotificationsApi {
  createNotification: (title: any, message: any, userId: any) => Promise<any>;
  getNotifications: (page: any) => Promise<any>;
  getNotificationsById: (id: any) => Promise<any>;
  patchNotificationsById: (id: any) => Promise<any>;
  deleteNotificationsById: (id: any) => Promise<any>;
}
export const Notifications: NotificationsApi = {
  /**
   * Create a new notification
   * Tags: Notifications
   * Method: POST
   * Path: /notifications
   * Responses: 201, 400, 500
   */

  createNotification: async (title, message, userId) => {
    if (typeof title !== "string") {
      throw new Error("Argument 'title' should be of type string ");
    }
    if (typeof message !== "string") {
      throw new Error("Argument 'message' should be of type string ");
    }
    if (typeof userId !== "string") {
      throw new Error("Argument 'userId' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/notifications`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: { title: `${title}`, message: `${message}`, userId: `${userId}` },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in createNotification:", error);
      throw error;
    }
  },

  /**
   * Get all notifications with pagination
   * Tags: Notifications
   * Method: GET
   * Path: /notifications
   * Responses: 200, 500
   */

  getNotifications: async (page) => {
    if (typeof page !== "number") {
      throw new Error("Argument 'page' should be of type integer ");
    }

    let config = {
      url: `http://localhost:8080/notifications?page=${encodeURIComponent(
        page,
      )}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getNotifications:", error);
      throw error;
    }
  },

  /**
   * Get a notification by ID
   * Tags: Notifications
   * Method: GET
   * Path: /notifications/{id}
   * Responses: 200, 404, 500
   */

  getNotificationsById: async (id) => {
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/notifications/${id}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getNotificationsById:", error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * Tags: Notifications
   * Method: PATCH
   * Path: /notifications/{id}
   * Responses: 200, 404, 500
   */

  patchNotificationsById: async (id) => {
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/notifications/${id}`,
      method: "patch",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in patchNotificationsById:", error);
      throw error;
    }
  },

  /**
   * Delete a notification by ID
   * Tags: Notifications
   * Method: DELETE
   * Path: /notifications/{id}
   * Responses: 200, 404, 500
   */

  deleteNotificationsById: async (id) => {
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/notifications/${id}`,
      method: "delete",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in deleteNotificationsById:", error);
      throw error;
    }
  },
};
