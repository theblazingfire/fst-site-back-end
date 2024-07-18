const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./config");

// Basic Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  failOnErrors: true,
  info: {
    title: "Express API with Swagger",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
    contact: {
      name: "Five and Six Technologies",
      email: "info@fiveandsixtechnologies.com",
    },
  },
  servers: [
    {
      url: `http://${config.host}:${config.port}`,
      description: "Development server",
    },
  ],
};

const options = {
  definition: {
    ...swaggerDefinition,
  },
  // Paths to files containing OpenAPI definitions
  apis: ["../routes/*.js"], // Change this to the path where your route files are located
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
