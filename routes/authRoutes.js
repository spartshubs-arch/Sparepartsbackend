// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');

// const { manualSignup, createSocialPassword } = require('../controllers/authController');

// // Manual Signup
// router.post('/signup', manualSignup);



// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // GOOGLE CALLBACK
// router.get('/google/callback', passport.authenticate('google', {
//   session: false,
//   failureRedirect: '/login'
// }), (req, res) => {
//   const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//   const { firstName, lastName, email } = req.user;
//   const redirectUrl = `http://localhost:3000/signup?token=${token}&firstName=${firstName}&lastName=${lastName}&email=${email}`;

//   res.redirect(redirectUrl);
// });

// // Same for FACEBOOK CALLBACK

// // FACEBOOK
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/facebook/callback', passport.authenticate('facebook', {
//   session: false,
//   failureRedirect: '/login'
// }), (req, res) => {
//   const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//   res.redirect(`http://localhost:3000/set-password?token=${token}`);
// });


// module.exports = router;





const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const { authenticateJWT } = require('../middleware/authMiddleware');




const {
  manualSignup,
  createSocialPassword, requireAdmin
} = require('../controllers/authController');


// Manual Signup
router.post('/signup', manualSignup);

// --- Google OAuth ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { firstName, lastName, email } = req.user;

      // Check if user exists or create temporary social user
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          firstName,
          lastName,
          email,
          password: null,   // no password yet
          isSocial: true,
        });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Redirect to frontend with pre-filled info
      const redirectUrl = `http://localhost:3001/signup?token=${token}&firstName=${firstName}&lastName=${lastName}&email=${email}`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
      res.redirect('/login?error=social_login_failed');
    }
  }
);

// --- Facebook OAuth ---
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { firstName, lastName, email } = req.user;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          firstName,
          lastName,
          email,
          password: null,
          isSocial: true,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      const redirectUrl = `http://localhost:3001/signup?token=${token}&firstName=${firstName}&lastName=${lastName}&email=${email}`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
      res.redirect('/login?error=social_login_failed');
    }
  }
);

// Social user sets their password
router.post('/set-social-password', authenticateJWT, createSocialPassword);



// login check 

router.post('/loginuser', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
      },
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/users/:id', authenticateJWT, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// routes/authRoutes.js
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/change-password", authenticateJWT, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
