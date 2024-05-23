const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const loginSignupRoutes = require("./routes/loginSignup");
const http = require("http");
const initializeSocket = require("./socket");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session duration in milliseconds (e.g., 1 day)
      secure: isProduction, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax', // Adjust based on environment
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // change later to 10 or 15 requests, right now its 1000 for testing purposes
});
app.use(limiter);

app.use("/api", loginSignupRoutes);
app.use("/auth", authRoutes);

const server = http.createServer(app);
initializeSocket(server);

// This prevents the app from automatically starting to listen
// when this file is imported/required in another file, such as during automated testing.
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
