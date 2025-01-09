// Notifications

export const Notifications = {
  /**
   * Create a new notification
   * Tags: Notifications
   * Method: POST
   * Path: /notifications
   * Responses: 201, 400, 500
   */

  createNotification: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/notifications`,

        data,
      });
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

  getNotifications: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/notifications`,
        params,
      });
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

  getNotificationsById: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/notifications/{id}`,
        params,
      });
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

  patchNotificationsById: async (params = {}) => {
    try {
      const response = await axios({
        method: "patch",
        url: `/api/notifications/{id}`,
        params,
      });
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

  deleteNotificationsById: async (params = {}) => {
    try {
      const response = await axios({
        method: "delete",
        url: `/api/notifications/{id}`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteNotificationsById:", error);
      throw error;
    }
  },
};
