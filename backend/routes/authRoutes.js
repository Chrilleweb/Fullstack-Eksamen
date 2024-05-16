const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const adminController = require("../controller/adminController");
const quitInfoController = require("../controller/quitInfoController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeAdmin = require("../middleware/authorizeAdmin");

router.get("/admin", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.admin_get);
router.get("/admin/users", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.getAllUsers);
router.put("/admin/:id", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.updateRole);
router.delete("/admin/:id", authenticateToken.authenticateToken, authorizeAdmin.authorizeAdmin, adminController.deleteUser);

router.get("/home", authenticateToken.authenticateToken, authController.home_get);

router.get("/quit-info/:userId", authenticateToken.authenticateToken, quitInfoController.getQuitInfo);
router.post("/quit-info", authenticateToken.authenticateToken, quitInfoController.addQuitInfo);
router.put("/quit-info/:userId", authenticateToken.authenticateToken, quitInfoController.updateQuitInfo);

module.exports = router;