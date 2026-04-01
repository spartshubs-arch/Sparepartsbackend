// routes/notificationRoutes.js

const express = require("express");
const router  = express.Router();
const {
  sendNotification,
  getAllNotifications,
  getAdminNotifications,
  getVendorNotifications,
  markAsRead,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

const { authenticateSuperAdmin } = require("../middleware/superAdminAuth");
const { authenticateJWT }        = require("../middleware/authMiddleware");

// Super admin routes
router.post("/",         authenticateSuperAdmin, sendNotification);
router.get("/all",       authenticateSuperAdmin, getAllNotifications);
router.delete("/:id",    authenticateSuperAdmin, deleteNotification);
router.put("/:id",       authenticateSuperAdmin, updateNotification);

// Admin reads their notifications
router.get("/admin",     authenticateJWT, getAdminNotifications);
router.put("/:id/read",  authenticateJWT, markAsRead);

// Vendor reads their notifications
router.get("/vendor",    authenticateJWT, getVendorNotifications);

module.exports = router;
