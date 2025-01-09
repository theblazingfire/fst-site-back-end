// Ping

export const Ping = {
  /**
   * Performs a ping request
   * Tags: Ping
   * Method: GET
   * Path: /
   * Responses: 200
   */

  get: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in get:", error);
      throw error;
    }
  },

  /**
   * Get server status
   * Tags: Ping
   * Method: GET
   * Path: /status
   * Responses: 200
   */

  getStatus: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/status`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getStatus:", error);
      throw error;
    }
  },

  /**
   * Get request logs
   * Tags: Ping
   * Method: GET
   * Path: /request-logs
   * Responses: 200, 500
   */

  getRequestlogs: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/request-logs`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getRequestlogs:", error);
      throw error;
    }
  },

  /**
   * Get application logs
   * Tags: Ping
   * Method: GET
   * Path: /app-logs
   * Responses: 200, 500
   */

  getApplogs: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/app-logs`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getApplogs:", error);
      throw error;
    }
  },

  /**
   * Clear request logs
   * Tags: Ping
   * Method: GET
   * Path: /clear-request-logs
   * Responses: 200, 500
   */

  getClearrequestlogs: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/clear-request-logs`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getClearrequestlogs:", error);
      throw error;
    }
  },

  /**
   * Clear application logs
   * Tags: Ping
   * Method: GET
   * Path: /clear-app-logs
   * Responses: 200, 500
   */

  getClearapplogs: async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/clear-app-logs`,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getClearapplogs:", error);
      throw error;
    }
  },
};
