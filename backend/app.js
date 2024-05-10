const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const loginSignupRoutes = require("./routes/loginSignup");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Allow this origin to access the server
  credentials: true, // Allow sending of cookies with requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods from the origin
  allowedHeaders: ["Content-Type", "Authorization"], // Headers that the origin can send
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session duration in milliseconds (e.g., 1 day)
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // change later to 10 or 15 requests, right now its 1000 for testing purposes
});
app.use(limiter);

app.use("/api", loginSignupRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
