// Transactions

import axios from "axios";
interface TransactionsApi {
  postTransactions: (token: any) => Promise<any>;
  getTransactions: (
    token: any,
    page: any,
    limit: any,
    userEmail: any,
    paymentMethod: any,
    paid: any,
  ) => Promise<any>;
  getTransactionsById: (token: any, id: any) => Promise<any>;
  putTransactionsById: (token: any, id: any) => Promise<any>;
  deleteTransactionsById: (token: any, id: any) => Promise<any>;
}
export const Transactions: TransactionsApi = {
  /**
   * Create a new transaction
   * Tags: Transactions
   * Method: POST
   * Path: /transactions
   * Responses: 201, 400, 500
   */

  postTransactions: async (token) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }

    let config = {
      url: `http://localhost:8080/transactions`,
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
      console.error("Error in postTransactions:", error);
      throw error;
    }
  },

  /**
   * Get all transactions
   * Tags: Transactions
   * Method: GET
   * Path: /transactions
   * Responses: 200, 500
   */

  getTransactions: async (
    token,
    page,
    limit,
    userEmail,
    paymentMethod,
    paid,
  ) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof page !== "number") {
      throw new Error("Argument 'page' should be of type integer ");
    }
    if (typeof limit !== "number") {
      throw new Error("Argument 'limit' should be of type integer ");
    }
    if (typeof userEmail !== "string") {
      throw new Error("Argument 'userEmail' should be of type string ");
    }
    if (typeof paymentMethod !== "string") {
      throw new Error("Argument 'paymentMethod' should be of type string ");
    }
    if (typeof paid !== "string") {
      throw new Error("Argument 'paid' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/transactions?page=${encodeURIComponent(
        page,
      )}&limit=${encodeURIComponent(limit)}&userEmail=${encodeURIComponent(
        userEmail,
      )}&paymentMethod=${encodeURIComponent(
        paymentMethod,
      )}&paid=${encodeURIComponent(paid)}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getTransactions:", error);
      throw error;
    }
  },

  /**
   * Get a transaction by ID
   * Tags: Transactions
   * Method: GET
   * Path: /transactions/{id}
   * Responses: 200, 404, 500
   */

  getTransactionsById: async (token, id) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/transactions/${id}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getTransactionsById:", error);
      throw error;
    }
  },

  /**
   * Update a transaction
   * Tags: Transactions
   * Method: PUT
   * Path: /transactions/{id}
   * Responses: 200, 404, 500
   */

  putTransactionsById: async (token, id) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/transactions/${id}`,
      method: "put",
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
      console.error("Error in putTransactionsById:", error);
      throw error;
    }
  },

  /**
   * Delete a transaction
   * Tags: Transactions
   * Method: DELETE
   * Path: /transactions/{id}
   * Responses: 200, 404, 500
   */

  deleteTransactionsById: async (token, id) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/transactions/${id}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in deleteTransactionsById:", error);
      throw error;
    }
  },
};
