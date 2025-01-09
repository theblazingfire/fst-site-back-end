// CustomerSupport

export const CustomerSupport = {
  /**
   * Post a new customer message
   * Tags: CustomerSupport
   * Method: POST
   * Path: /messages
   * Responses: 201, 400, 500
   */

  postMessages: async (data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/messages`,

        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postMessages:", error);
      throw error;
    }
  },

  /**
   * Retrieve customer messages
   * Tags: CustomerSupport
   * Method: GET
   * Path: /messages
   * Responses: 200, 400, 500
   */

  getMessages: async (params = {}) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/messages`,
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error in getMessages:", error);
      throw error;
    }
  },

  /**
   * Reply to a customer message
   * Tags: CustomerSupport
   * Method: POST
   * Path: /messages/{messageId}/reply
   * Responses: 200, 404, 500
   */

  postMessagesByMessageIdReply: async (params = {}, data = {}) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/messages/{messageId}/reply`,
        params,
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Error in postMessagesByMessageIdReply:", error);
      throw error;
    }
  },
};
