const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/userModel');
const Vendor = require('../models/Vendor');



exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, message } = req.body;

    if (!username || !password || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount >= 2) {
      return res.status(400).json({ message: "❌ Only 2 admins allowed." });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "❌ Username already exists." });
    }

    // ✅ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ 
      username, 
      password: hashedPassword, 
      registeredBy: message 
    });

    await newAdmin.save();

    res.status(201).json({ message: "✅ Admin registered successfully." });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "❌ Server error." });
  }
};

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// for the admin stats 
exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();

    res.json({
      vendors: totalVendors,
      orders: totalOrders,
      users: totalUsers,
     
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};


exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};


exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const deleted = await Vendor.findByIdAndDelete(vendorId);
    if (!deleted) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deletion failed" });
  }
};



// for vendor appr 
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "✅ User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "❌ Failed to delete user" });
  }
};
