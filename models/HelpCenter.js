const mongoose = require("mongoose");

const helpCenterSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    requestCallback: { type: String, default: "" },
    contactUs: { type: String, default: "" },
    quickTip: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HelpCenter", helpCenterSchema);
