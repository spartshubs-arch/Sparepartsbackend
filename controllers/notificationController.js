// controllers/notificationController.js

const Notification = require("../models/Notification");

// Super admin sends a notification
exports.sendNotification = async (req, res) => {
  try {
    const { subject, message, targetType } = req.body;

    if (!subject || !message || !targetType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const notification = new Notification({ subject, message, targetType });
    await notification.save();

    res.status(201).json({ message: "✅ Notification sent successfully.", notification });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ message: "❌ Server error." });
  }
};

// Get all notifications (super admin)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

// Get notifications for admins
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetType: { $in: ["admin", "both"] },
    }).sort({ createdAt: -1 });

    // attach isRead per requesting admin
    const adminId = req.adminId?.toString();
    const result = notifications.map((n) => ({
      ...n.toObject(),
      isRead: n.readBy.includes(adminId),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin notifications." });
  }
};

// Get notifications for vendors
exports.getVendorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetType: { $in: ["vendor", "both"] },
    }).sort({ createdAt: -1 });

    const vendorId = req.vendorId?.toString();
    const result = notifications.map((n) => ({
      ...n.toObject(),
      isRead: n.readBy.includes(vendorId),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendor notifications." });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    // works for both admin and vendor — whichever ID is present
    const readerId = (req.adminId || req.vendorId)?.toString();

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { readBy: readerId },
    });

    res.json({ message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read." });
  }
};

// Super admin deletes a notification
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notification not found." });
    res.json({ message: "✅ Notification deleted." });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete notification." });
  }
};

// Super admin updates a notification
exports.updateNotification = async (req, res) => {
  try {
    const { subject, message, targetType } = req.body;
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { subject, message, targetType },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found." });
    res.json({ message: "✅ Notification updated.", notification: updated });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update notification." });
  }
};
