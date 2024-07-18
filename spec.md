Here’s a comprehensive list of the functions/endpoints/middlewares you should include in your Node.js application to create a reusable base template:

1. **Ping Function/Endpoint:**

   - Base `/` route for health check, returning 'awake' and status 200.
   - Optionally, add additional health check routes like `/status` to provide more detailed information about the server status.

2. **Authentication Endpoints:**

   - Login (email & password, Google, Facebook, Apple, Twitter).
   - Signup.
   - OTP generation and verification.
   - Forgot password.
   - Password reset.
   - Logout.
   - Refresh token.

3. **User Management Endpoints:**

   - Disable account.
   - Enable account.
   - Update user profile.
   - Delete account.
   - Fetch user details.
   - List all users (admin only).

4. **JWT Token Verification Middleware:**

   - Middleware to verify JWT tokens and protect routes.

5. **Error Handling Middleware:**

   - Centralized error handling middleware to manage and respond to errors gracefully.

6. **Multipart/Form-data Handling Middleware:**

   - Middleware (like `multer`) to handle file uploads and form-data.

7. **Logging with Morgan:**

   - Integrate Morgan for HTTP request logging.

8. **Nodemailer/Emailing Configuration:**

   - Setup Nodemailer for sending emails.
   - Configurations for different email services (e.g., SMTP, SendGrid).

9. **Email Templates:**

   - Predefined email templates for common actions (e.g., account verification, password reset).

10. **Additional Features:**
    - **Rate Limiting Middleware:** To protect against brute force attacks.
    - **CORS Middleware:** To handle Cross-Origin Resource Sharing.
    - **Helmet Middleware:** For securing HTTP headers.
    - **Compression Middleware:** For Gzip compression.
    - **Body Parsing Middleware:** (`body-parser` for JSON and URL-encoded data).
    - **Environment Configuration:** Using `dotenv` to manage environment variables.
    - **Database Connection:** Setup for connecting to databases (e.g., MongoDB, PostgreSQL).
    - **Seeding and Migration:** Scripts for seeding initial data and database migrations.
    - **Swagger Documentation:** For API documentation.
    - **Testing Setup:** Basic setup for unit and integration tests (e.g., using Jest).
    - **Role-Based Access Control (RBAC):** Middleware to handle user roles and permissions.
    - **Security Middleware:** Additional security practices (e.g., sanitizing input, rate limiting, etc.).

Here’s a brief example of how to set up some of these in your Node.js application:

```javascript
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

const upload = multer({ dest: "uploads/" });

// Ping route
app.get("/", (req, res) => {
  res.status(200).send("awake");
});

// Authentication routes
app.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  (req, res) => {
    // Handle login
  },
);

app.post(
  "/signup",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  (req, res) => {
    // Handle signup
  },
);

// JWT Verification middleware
const verifyJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

You can expand and customize this setup based on your specific needs.
