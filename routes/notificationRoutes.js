const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("../middleware/authMiddleware");
const { authenticateSuperAdmin } = require("../middleware/superAdminAuth");

const {
  getVendorRecipients,
  getAdminRecipients,
  getUserRecipients,
  sendSuperAdminNotifications,
  getAllNotifications,
  getAdminNotifications,
  getVendorNotifications,
  getUserNotifications,
  getUserUnreadCount,
  getAdminUnreadCount,
  getVendorUnreadCount,
  markAsRead,
  markAllUserNotificationsRead,
  markAllAdminNotificationsRead,
  markAllVendorNotificationsRead,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

// ─────────────────────────────────────────────────────────────
// Super Admin routes
// Use authenticateSuperAdmin here, not authenticateJWT
// ─────────────────────────────────────────────────────────────
router.get("/all", authenticateSuperAdmin, getAllNotifications);

router.get("/recipients/vendors", authenticateSuperAdmin, getVendorRecipients);
router.get("/recipients/admins", authenticateSuperAdmin, getAdminRecipients);
router.get("/recipients/users", authenticateSuperAdmin, getUserRecipients);

router.post(
  "/superadmin/send",
  authenticateSuperAdmin,
  sendSuperAdminNotifications
);

router.put("/:id", authenticateSuperAdmin, updateNotification);
router.delete("/:id", authenticateSuperAdmin, deleteNotification);

// ─────────────────────────────────────────────────────────────
// User routes
// ─────────────────────────────────────────────────────────────
router.get("/user/unread-count", authenticateJWT, getUserUnreadCount);
router.get("/user", authenticateJWT, getUserNotifications);
router.put("/user/mark-all-read", authenticateJWT, markAllUserNotificationsRead);

// ─────────────────────────────────────────────────────────────
// Admin routes
// ─────────────────────────────────────────────────────────────
router.get("/admin/unread-count", authenticateJWT, getAdminUnreadCount);
router.get("/admin", authenticateJWT, getAdminNotifications);
router.put("/admin/mark-all-read", authenticateJWT, markAllAdminNotificationsRead);

// ─────────────────────────────────────────────────────────────
// Vendor routes
// ─────────────────────────────────────────────────────────────
router.get("/vendor/unread-count", authenticateJWT, getVendorUnreadCount);
router.get("/vendor", authenticateJWT, getVendorNotifications);
router.put("/vendor/mark-all-read", authenticateJWT, markAllVendorNotificationsRead);

// ─────────────────────────────────────────────────────────────
// Shared read route
// ─────────────────────────────────────────────────────────────
router.put("/:id/read", authenticateJWT, markAsRead);

module.exports = router;
