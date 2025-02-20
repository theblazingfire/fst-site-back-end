// Bootcamp

import axios from "axios";
interface BootcampApi {
  postBootcamp: (token: any, name: any, start: any, end: any) => Promise<any>;
  getBootcamp: (
    page: any,
    limit: any,
    name: any,
    student: any,
    paymentStatus: any,
  ) => Promise<any>;
  getBootcampById: (id: any) => Promise<any>;
  putBootcampById: (
    token: any,
    id: any,
    paymentId: any,
    paymentStatus: any,
  ) => Promise<any>;
  deleteBootcampById: (token: any, id: any) => Promise<any>;
}
export const Bootcamp: BootcampApi = {
  /**
   * Register for a Bootcamp
   * Tags: Bootcamp
   * Method: POST
   * Path: /bootcamp
   * Responses: 201, 500
   */

  postBootcamp: async (token, name, start, end) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof name !== "string") {
      throw new Error("Argument 'name' should be of type string ");
    }
    if (typeof start !== "string") {
      throw new Error(
        "Argument 'start' should be of type string in the date format",
      );
    }
    if (typeof end !== "string") {
      throw new Error(
        "Argument 'end' should be of type string in the date format",
      );
    }

    let config = {
      url: `http://localhost:8080/bootcamp`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { name: `${name}`, start: `${start}`, end: `${end}` },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in postBootcamp:", error);
      throw error;
    }
  },

  /**
   * Get all Bootcamp Registrations
   * Tags: Bootcamp
   * Method: GET
   * Path: /bootcamp
   * Responses: 200, 500
   */

  getBootcamp: async (page, limit, name, student, paymentStatus) => {
    if (typeof page !== "number") {
      throw new Error("Argument 'page' should be of type integer ");
    }
    if (typeof limit !== "number") {
      throw new Error("Argument 'limit' should be of type integer ");
    }
    if (typeof name !== "string") {
      throw new Error("Argument 'name' should be of type string ");
    }
    if (typeof student !== "string") {
      throw new Error("Argument 'student' should be of type string ");
    }
    if (typeof paymentStatus !== "string") {
      throw new Error("Argument 'paymentStatus' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/bootcamp?page=${encodeURIComponent(
        page,
      )}&limit=${encodeURIComponent(limit)}&name=${encodeURIComponent(
        name,
      )}&student=${encodeURIComponent(
        student,
      )}&paymentStatus=${encodeURIComponent(paymentStatus)}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getBootcamp:", error);
      throw error;
    }
  },

  /**
   * Get Bootcamp Registration by ID
   * Tags: Bootcamp
   * Method: GET
   * Path: /bootcamp/{id}
   * Responses: 200, 404, 500
   */

  getBootcampById: async (id) => {
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/bootcamp/${id}`,
      method: "get",
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in getBootcampById:", error);
      throw error;
    }
  },

  /**
   * Update Bootcamp Registration
   * Tags: Bootcamp
   * Method: PUT
   * Path: /bootcamp/{id}
   * Responses: 200, 404, 500
   */

  putBootcampById: async (token, id, paymentId, paymentStatus) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }
    if (typeof paymentId !== "string") {
      throw new Error("Argument 'paymentId' should be of type string ");
    }
    if (typeof paymentStatus !== "string") {
      throw new Error("Argument 'paymentStatus' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/bootcamp/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { paymentId: `${paymentId}`, paymentStatus: `${paymentStatus}` },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in putBootcampById:", error);
      throw error;
    }
  },

  /**
   * Delete Bootcamp Registration
   * Tags: Bootcamp
   * Method: DELETE
   * Path: /bootcamp/{id}
   * Responses: 200, 404, 500
   */

  deleteBootcampById: async (token, id) => {
    if (typeof token !== "string") {
      throw new Error("Argument 'token' should be of type string");
    }
    if (typeof id !== "string") {
      throw new Error("Argument 'id' should be of type string ");
    }

    let config = {
      url: `http://localhost:8080/bootcamp/${id}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in deleteBootcampById:", error);
      throw error;
    }
  },
};
