// ServiceOrder

import axios from "axios";
interface ServiceOrderApi {
  postServiceorder: (
    token: any,
    name: any,
    packageType: any,
    client: any,
    userEmail: any,
  ) => Promise<any>;
  getServiceorder: (page: any, limit: any, client: any) => Promise<any>;
  getServiceorderById: (id: any) => Promise<any>;
  putServiceorderById: (
    token: any,
    id: any,
    paymentMethod: any,
    preferredCommunicationChannel: any,
    projectName: any,
    estimatedDeliveryDate: any,
  ) => Promise<any>;
  deleteServiceorderById: (token: any, id: any) => Promise<any>;
}
export const ServiceOrder: ServiceOrderApi = {
  /**
   * Create a new service order
   * Tags: ServiceOrder
   * Method: POST
   * Path: /service-order
   * Responses: 201, 401, 500
   */

  postServiceorder: async (token, name, packageType, client, userEmail) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof name !== "string") {
      throw new Error("Argument 'name' should be of type string ");
    }
    if (typeof packageType !== "string") {
      throw new Error("Argument 'packageType' should be of type string ");
    }
    if (typeof client !== "string") {
      throw new Error(
        "Argument 'client' should be of type string in the uuid format",
      );
    }
    if (typeof userEmail !== "string") {
      throw new Error(
        "Argument 'userEmail' should be of type string in the email format",
      );
    }

    let config = {
      url: `http://localhost:8080/service-order`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: `${name}`,
        packageType: `${packageType}`,
        client: `${client}`,
        userEmail: `${userEmail}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in postServiceorder:", error);
      throw error;
    }
  },

  /**
   * Get all service orders with filtering and pagination
   * Tags: ServiceOrder
   * Method: GET
   * Path: /service-order
   * Responses: 200, 500
   */

  getServiceorder: async (page, limit, client) => {
    if (typeof page !== "number") {
      throw new Error("Argument 'page' should be of type integer ");
    }
    if (typeof limit !== "number") {
      throw new Error("Argument 'limit' should be of type integer ");
    }
    if (typeof client !== "string") {
      throw new Error(
        "Argument 'client' should be of type string in the uuid format",
      );
    }

    let config = {
      url: `http://localhost:8080/service-order?page=${encodeURIComponent(
        page,
      )}&limit=${encodeURIComponent(limit)}&client=${encodeURIComponent(
        client,
      )}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getServiceorder:", error);
      throw error;
    }
  },

  /**
   * Get a specific service order by ID
   * Tags: ServiceOrder
   * Method: GET
   * Path: /service-order/{id}
   * Responses: 200, 404, 500
   */

  getServiceorderById: async (id) => {
    if (typeof id !== "string") {
      throw new Error(
        "Argument 'id' should be of type string in the uuid format",
      );
    }

    let config = {
      url: `http://localhost:8080/service-order/${id}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getServiceorderById:", error);
      throw error;
    }
  },

  /**
   * Update a specific service order by ID
   * Tags: ServiceOrder
   * Method: PUT
   * Path: /service-order/{id}
   * Responses: 200, 400, 401, 500
   */

  putServiceorderById: async (
    token,
    id,
    paymentMethod,
    preferredCommunicationChannel,
    projectName,
    estimatedDeliveryDate,
  ) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error(
        "Argument 'id' should be of type string in the uuid format",
      );
    }
    if (typeof paymentMethod !== "string") {
      throw new Error("Argument 'paymentMethod' should be of type string ");
    }
    if (typeof preferredCommunicationChannel !== "string") {
      throw new Error(
        "Argument 'preferredCommunicationChannel' should be of type string ",
      );
    }
    if (typeof projectName !== "string") {
      throw new Error("Argument 'projectName' should be of type string ");
    }
    if (typeof estimatedDeliveryDate !== "string") {
      throw new Error(
        "Argument 'estimatedDeliveryDate' should be of type string in the date format",
      );
    }

    let config = {
      url: `http://localhost:8080/service-order/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        paymentMethod: `${paymentMethod}`,
        preferredCommunicationChannel: `${preferredCommunicationChannel}`,
        projectName: `${projectName}`,
        estimatedDeliveryDate: `${estimatedDeliveryDate}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in putServiceorderById:", error);
      throw error;
    }
  },

  /**
   * Delete a specific service order by ID
   * Tags: ServiceOrder
   * Method: DELETE
   * Path: /service-order/{id}
   * Responses: 200, 401, 404, 500
   */

  deleteServiceorderById: async (token, id) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error(
        "Argument 'id' should be of type string in the uuid format",
      );
    }

    let config = {
      url: `http://localhost:8080/service-order/${id}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in deleteServiceorderById:", error);
      throw error;
    }
  },
};
