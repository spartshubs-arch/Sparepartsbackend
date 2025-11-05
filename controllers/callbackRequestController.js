const CallbackRequest = require("../models/CallbackRequest");

// Create a new callback request
exports.createCallbackRequest = async (req, res) => {
  try {
    const { name, email, phone, reason } = req.body;

    if (!name || !email || !phone || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new CallbackRequest({ name, email, phone, reason });
    await newRequest.save();

    res.status(201).json({ message: "Callback request saved successfully" });
  } catch (error) {
    console.error("Error saving callback request:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllCallbackRequests = async (req, res) => {
  try {
    const requests = await CallbackRequest.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching callback requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.deleteCallbackRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await CallbackRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Server error" });
  }
};