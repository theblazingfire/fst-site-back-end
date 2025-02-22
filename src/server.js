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
const profileModel = require("./models/profile.model");
const pingRoute = require("./routes/ping.route");
const authRoute = require("./routes/auth.route");
const profileRoutes = require("./routes/profile.route");
const customerSupportRoute = require("./routes/customer_messages.route");
const notificationRoute = require("./routes/notification.route");
const transactionsRoute = require("./routes/transactions.route");
const chatRoute = require("./routes/chat.route");
const serviceOrderRoute = require("./routes/service_orders.route");
const bootcampRoute = require("./routes/bootcamp.route");
const YAML = require("yamljs");
const path = require("path");
const mongoose = require("mongoose");

const { swaggerUi } = require("./utils/swaggerConfig");
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

const connectDB = require("./utils/dbConnect");

let database;
if (config.NODE_ENV == "production") {
  database = config.PROD_DB;
} else if (config.NODE_ENV == "development") {
  database = config.DEV_DB;
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
app.use("/profile", profileRoutes);
app.use("/", customerSupportRoute);
app.use("/notifications", notificationRoute);
app.use("/chats", chatRoute);
app.use("/transactions", transactionsRoute);
app.use("/bootcamp", bootcampRoute);
app.use("/service-order", serviceOrderRoute);

//setup complete
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);
// Integrate Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true, // Allow credentials (cookies, authorization headers)
  },
});
io.on("connection", (socket) => {
  logger.infoLogger("A user connected - socket.io");

  socket.on("message", (msg) => {
    logger.infoLogger(`Message Recieved`);
    logger.infoLogger(msg);
    // Broadcast message to all connected clients
    io.emit("message", msg);
  });
  socket.on("user_online", async (userId) => {
    try {
      logger.infoLogger(
        `User Online Event - userId: ${userId}, socketId: ${socket.id}`,
      );

      // Update the profile with the user's socket ID
      const userIdObjectId = new mongoose.Types.ObjectId(userId);
      const updateResult = await profileModel.updateOne(
        { user: userIdObjectId },
        { socketId: socket.id, online: true },
      );

      if (updateResult.nModified > 0) {
        logger.infoLogger(`Socket ID updated for user ${userId}`);
      } else {
        logger.infoLogger(
          `No user found or socket ID already up-to-date for user ${userId}`,
        );
      }
    } catch (err) {
      logger.errorLogger(
        `Failed to update socket ID for user ${userId}: ${err.message}`,
      );
    }
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
