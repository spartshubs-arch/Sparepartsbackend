const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.manualSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      authProvider: 'manual'
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createSocialPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // If your middleware attaches `req.user.id`
    const userId = req.user?.id || req.userId;  // support both styles

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password) {
      return res.status(400).json({ message: 'Password already set' });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
