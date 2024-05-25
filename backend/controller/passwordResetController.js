const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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

// Handles requests to send a password reset email
const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // 1 hour

    const username = user.username;

    await User.saveResetToken(user.id, token, expiration);

    const resetLink = `https://fullstack-eksamen.vercel.app/reset-password/${token}`;
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #4CAF50;
            color: white;
            border-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            font-size: 0.8em;
            color: #777;
            padding: 20px;
            border-top: 1px solid #eaeaea;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header"></div>
        <div class="content">
            <p>Hello ${username},</p>
            <p>You requested a password reset. Please click the button below to set a new password. If you did not request this, please ignore this email.</p>
            <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
            <p>Best regards,<br>The QuitSmarter Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} QuitSmarter. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: "\"QuitSmarter\" quitsmarter@gmail.com",
      to: email,
      subject: "Password Reset",
      html: emailHtml,
    });

    res.status(200).json({ message: `Email sent to ${email}. Please check your email to reset your password.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// Handles requests to reset a password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findByResetToken(token);
    if (!user || new Date() > new Date(user.resetTokenExpiration)) {
      return res.status(400).json({ message: "Invalid or Expired token" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Validate password length
    if (newPassword.length < 6 || newPassword.length > 20) {
      return res.status(400).json({ message: "Password must be between 6 and 20 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(user.id, hashedPassword);

    res.status(200).json({ message: "Password has been reset successfully. " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  sendResetEmail,
  resetPassword,
};

