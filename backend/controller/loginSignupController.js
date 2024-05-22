const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Configure Nodemailer to use Mailgun SMTP for sending emails
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "quitsmarter@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

const signup_post = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate username for invalid characters
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({ message: "Username can only contain alphanumeric characters" });
    }

    // Validate username length
    if (username.length < 3 || username.length > 15) {
      return res.status(400).json({ message: "Username must be between 3 and 15 characters long" });
    }

    // Validate password length
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ message: "Password must be between 6 and 20 characters long" });
    }

    // Check if username and password are provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // check if email is valid
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    // Check if the username is taken
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Check if the email is taken
    const existingEmail = await User.findByEmail(email);
    if(existingEmail) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userRole = "user";

    // Create a new user
    const newUser = { username, email, password: hashedPassword, role: userRole };
    await User.create(newUser);

    // Send a welcome email
    const welcomeEmailHtml = `
    <html>
      <body>
        <p>Hi ${username},</p>
        <p>Thank you for signing up. We are glad to have you on board.</p>
        <p>Let's make your smoke-free journey successful together!</p>
        <p>Best regards,<br>The QuitSmarter Team</p>
      </body>
    </html>`;

    await transporter.sendMail({
      from: "\"QuitSmarter\" quitsmarter@gmail.com",
      to: email,
      subject: "Welcome to QuitSmarter!",
      html: welcomeEmailHtml,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login_post = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username and password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create and sign a JWT using the secret key from environment variable
    const token = jwt.sign(
      { userId: user.id, userName: user.username, email: user.email, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (e.g., 1 day)
      httpOnly: true,
    });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login failed: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout_get = (req, res) => {
  res.clearCookie("token");
  req.session.destroy();
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  signup_post,
  login_post,
  logout_get,
};
