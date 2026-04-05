
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["admin", "vendor", "user"],
      required: true,
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",
    },

    recipientModel: {
      type: String,
      enum: ["Admin", "Vendor", "User"],
      required: true,
    },

    senderType: {
      type: String,
      enum: ["superadmin", "system"],
      default: "superadmin",
    },

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

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
