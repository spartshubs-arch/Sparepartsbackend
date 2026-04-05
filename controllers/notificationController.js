const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const User = require("../models/userModel");

const MODEL_BY_TYPE = {
  vendor: Vendor,
  admin: Admin,
  user: User,
};

const MODEL_NAME_BY_TYPE = {
  vendor: "Vendor",
  admin: "Admin",
  user: "User",
};

const getDisplayName = (type, doc) => {
  if (type === "vendor") {
    const fullName = [doc.firstName, doc.lastName].filter(Boolean).join(" ").trim();
    return fullName || doc.tradeName || "Vendor";
  }

  if (type === "admin") {
    return doc.username || "Admin";
  }

  if (type === "user") {
    const fullName = [doc.firstName, doc.lastName].filter(Boolean).join(" ").trim();
    return fullName || doc.email || "User";
  }

  return "Recipient";
};

const getRecipientOwner = (req) => {
  if (req.userType === "admin") {
    return {
      recipientType: "admin",
      recipientId: req.adminId,
      recipientModel: "Admin",
    };
  }

  if (req.userType === "vendor") {
    return {
      recipientType: "vendor",
      recipientId: req.vendorId,
      recipientModel: "Vendor",
    };
  }

  if (req.userType === "user") {
    return {
      recipientType: "user",
      recipientId: req.userId,
      recipientModel: "User",
    };
  }

  return null;
};

// ─────────────────────────────────────────────────────────────
// Super Admin recipient lists
// ─────────────────────────────────────────────────────────────

exports.getVendorRecipients = async (req, res) => {
  try {
    const vendors = await Vendor.find({})
      .select("_id idNumber firstName lastName tradeName")
      .sort({ createdAt: -1 });

    const formatted = vendors.map((v) => ({
      _id: v._id,
      name: getDisplayName("vendor", v),
      subtitle: `ID: ${v.idNumber || "N/A"}`,
      idNumber: v.idNumber || "",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching vendor recipients:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

exports.getAdminRecipients = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select("_id username isApproved")
      .sort({ createdAt: -1 });

    const formatted = admins.map((a) => ({
      _id: a._id,
      name: a.username || "Admin",
      subtitle: `ID: ${a._id.toString()}`,
      isApproved: a.isApproved,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching admin recipients:", error);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

exports.getUserRecipients = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id firstName lastName email")
      .sort({ createdAt: -1 });

    const formatted = users.map((u) => ({
      _id: u._id,
      name: getDisplayName("user", u),
      subtitle: `Email: ${u.email || "N/A"}`,
      email: u.email || "",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching user recipients:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ─────────────────────────────────────────────────────────────
// Super Admin send notifications
// ─────────────────────────────────────────────────────────────

exports.sendSuperAdminNotifications = async (req, res) => {
  try {
    const {
      recipientType,
      recipientIds = [],
      subject,
      message,
      sendToAll = false,
    } = req.body;

    if (!["vendor", "admin", "user"].includes(recipientType)) {
      return res.status(400).json({ message: "Invalid recipient type" });
    }

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const Model = MODEL_BY_TYPE[recipientType];
    const recipientModel = MODEL_NAME_BY_TYPE[recipientType];

    let recipients = [];

    if (sendToAll) {
      recipients = await Model.find({}).select("_id");
    } else {
      if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
        return res.status(400).json({ message: "Please select at least one recipient" });
      }

      const validIds = recipientIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      if (validIds.length === 0) {
        return res.status(400).json({ message: "No valid recipient IDs found" });
      }

      recipients = await Model.find({ _id: { $in: validIds } }).select("_id");
    }

    if (!recipients.length) {
      return res.status(404).json({ message: "No recipients found" });
    }

    const docs = recipients.map((recipient) => ({
      recipientType,
      recipientId: recipient._id,
      recipientModel,
      senderType: "superadmin",
      subject: subject.trim(),
      message: message.trim(),
      isRead: false,
    }));

    await Notification.insertMany(docs);

    res.status(201).json({
      message: `Notification sent successfully to ${recipients.length} ${recipientType}(s)`,
      sentCount: recipients.length,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ message: "Server error while sending notifications" });
  }
};

// ─────────────────────────────────────────────────────────────
// Super Admin get all notifications
// ─────────────────────────────────────────────────────────────

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    console.error("Get all notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ─────────────────────────────────────────────────────────────
// Admin notifications
// ─────────────────────────────────────────────────────────────

exports.getAdminNotifications = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const notifications = await Notification.find({
      recipientType: "admin",
      recipientId: req.adminId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({ message: "Failed to fetch admin notifications" });
  }
};

exports.getAdminUnreadCount = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const unreadCount = await Notification.countDocuments({
      recipientType: "admin",
      recipientId: req.adminId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Get admin unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

exports.markAllAdminNotificationsRead = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(403).json({ message: "Admin access required" });
    }

    await Notification.updateMany(
      {
        recipientType: "admin",
        recipientId: req.adminId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ message: "All admin notifications marked as read" });
  } catch (error) {
    console.error("Mark all admin notifications read error:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// ─────────────────────────────────────────────────────────────
// Vendor notifications
// ─────────────────────────────────────────────────────────────

exports.getVendorNotifications = async (req, res) => {
  try {
    if (!req.vendorId) {
      return res.status(403).json({ message: "Vendor access required" });
    }

    const notifications = await Notification.find({
      recipientType: "vendor",
      recipientId: req.vendorId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Get vendor notifications error:", error);
    res.status(500).json({ message: "Failed to fetch vendor notifications" });
  }
};

exports.getVendorUnreadCount = async (req, res) => {
  try {
    if (!req.vendorId) {
      return res.status(403).json({ message: "Vendor access required" });
    }

    const unreadCount = await Notification.countDocuments({
      recipientType: "vendor",
      recipientId: req.vendorId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Get vendor unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

exports.markAllVendorNotificationsRead = async (req, res) => {
  try {
    if (!req.vendorId) {
      return res.status(403).json({ message: "Vendor access required" });
    }

    await Notification.updateMany(
      {
        recipientType: "vendor",
        recipientId: req.vendorId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ message: "All vendor notifications marked as read" });
  } catch (error) {
    console.error("Mark all vendor notifications read error:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// ─────────────────────────────────────────────────────────────
// User notifications
// ─────────────────────────────────────────────────────────────

exports.getUserNotifications = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(403).json({ message: "User access required" });
    }

    const notifications = await Notification.find({
      recipientType: "user",
      recipientId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Get user notifications error:", error);
    res.status(500).json({ message: "Failed to fetch user notifications" });
  }
};

exports.getUserUnreadCount = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(403).json({ message: "User access required" });
    }

    const unreadCount = await Notification.countDocuments({
      recipientType: "user",
      recipientId: req.userId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Get user unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

exports.markAllUserNotificationsRead = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(403).json({ message: "User access required" });
    }

    await Notification.updateMany(
      {
        recipientType: "user",
        recipientId: req.userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({ message: "All user notifications marked as read" });
  } catch (error) {
    console.error("Mark all user notifications read error:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// ─────────────────────────────────────────────────────────────
// Shared single mark-as-read
// ─────────────────────────────────────────────────────────────

exports.markAsRead = async (req, res) => {
  try {
    const owner = getRecipientOwner(req);

    if (!owner) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientType: owner.recipientType,
        recipientId: owner.recipientId,
      },
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Marked as read", notification: updated });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// ─────────────────────────────────────────────────────────────
// Delete notification
// ─────────────────────────────────────────────────────────────

exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// ─────────────────────────────────────────────────────────────
// Update notification
// NOTE: Updating a sent notification only updates one row/document.
// Since selected/all sending creates many documents, avoid using update
// for broadcast editing unless you build a campaign/groupId system.
// ─────────────────────────────────────────────────────────────

exports.updateNotification = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        ...(subject ? { subject: subject.trim() } : {}),
        ...(message ? { message: message.trim() } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      message: "Notification updated successfully",
      notification: updated,
    });
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};
