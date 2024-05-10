const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const adminController = require("../controller/adminController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeAdmin = require("../middleware/authorizeAdmin");

router.get("/admin", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.admin_get);
router.get("/admin/users", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.getAllUsers);
router.put("/admin/:id", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.updateRole);
router.delete("/admin/:id", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.deleteUser);

router.get("/home", authenticateToken.authenticateToken, authController.home_get);

module.exports = router;