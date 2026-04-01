
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    registeredBy: {
      type: String
    },
    isApproved: {
      type: Boolean,
      default: false
    },

    // ── Added for Super Admin permission control ──────────────
    accessType: {
      type: String,
      enum: ["all", "selected"],
      default: "all"
    },
    allowedPages: {
      type: [String],
      default: []
    }
    // ─────────────────────────────────────────────────────────

  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
