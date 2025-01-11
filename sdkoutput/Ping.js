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
    let config = {
      url: `/`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `/status`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `/request-logs`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `/app-logs`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `/clear-request-logs`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
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
    let config = {
      url: `/clear-app-logs`,
      method: "get",
      baseUrl: "https://example.com",
      headers: {
        "Content-Type": "false",
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getClearapplogs:", error);
      throw error;
    }
  },
};
