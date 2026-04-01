// models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ["admin", "vendor", "both"],
      required: true,
    },
    readBy: {
      // stores IDs of admins/vendors who have read it
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
