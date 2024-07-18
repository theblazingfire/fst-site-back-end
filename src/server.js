//import dependencies
const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express"); // import express
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./functions/error.middleware"); // Adjust path as necessary
const apiLimiter = require("./utils/apiLimiter"); // Import your rate limiting configuration
const helmet = require("helmet");
const pingRoute = require("./routes/ping.route");
const authRoute = require("./routes/auth.route");
const profileRoutes = require('./routes/profile.route');

const YAML = require("yamljs");
const path = require("path");

const { swaggerUi } = require("./utils/swaggerConfig");
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

const connectDB = require("./utils/dbConnect");

let database;
if (config.NODE_ENV == "production") {
  database = process.env.PROD_DB;
} else if (config.NODE_ENV == "development") {
  database = "mongodb://localhost:27017/development";
} else {
  database = "mongodb://localhost:27017/test";
}

//connect to database
connectDB(database)
  .then(() => logger.infoLogger("Success : connected to database"))
  .catch((err) => {
    logger.errorLogger("Error in connecting to database");
    logger.errorLogger(err);
  });

// create express app
const app = express();
// install middlewares
app.use(apiLimiter);
app.use(cors()); // cors middleware
app.use(helmet());
app.use(morgan("combined", { stream: logger.accessLogStream })); // request logger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true }),
); // swagger documentation setup
app.use(express.json()); // body parsing middleware
app.use("/", pingRoute);
app.use("/auth", authRoute);
app.use('/profile', profileRoutes);
//setup complete
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Integrate Socket.IO
const io = socketIo(server);
io.on("connection", (socket) => {
  logger.infoLogger("A user connected - socket.io");

  socket.on("message", (msg) => {
    logger.infoLogger(`Message Recieved`);
    logger.infoLogger(msg);
    // Broadcast message to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    logger.infoLogger("User Disconnected");
  });
});

// Function to start the server
const startServer = async () => {
  try {
    await connectDB(database);
    logger.infoLogger("Success: connected to database");
    server.listen(config.port, config.host, () => {
      logger.infoLogger(
        `Server running on http://${config.host}:${config.port}`,
      );
    });
  } catch (err) {
    logger.errorLogger("Error in connecting to database");
    logger.errorLogger(err);
    throw err;
  }
};

module.exports = { app, startServer };
