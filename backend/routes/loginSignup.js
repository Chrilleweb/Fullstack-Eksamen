const express = require("express");
const router = express.Router();
const loginSignupController = require("../controller/loginSignupController");
const passwordResetController = require("../controller/passwordResetController");

router.post("/signup", loginSignupController.signup_post);
router.post("/login", loginSignupController.login_post);
router.get("/logout", loginSignupController.logout_get);

router.post("/request-reset", passwordResetController.sendResetEmail);
router.post("/reset-password/:token", passwordResetController.resetPassword);

module.exports = router;