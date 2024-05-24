const express = require("express");
const helmet = require("helmet");
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40,
});
app.use(limiter);

app.use("/api", loginSignupRoutes);
app.use("/auth", authRoutes);

const server = http.createServer(app);
initializeSocket(server);

// This prevents the app from automatically starting to listen
// when this file is imported/required in another file during automated testing.
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
