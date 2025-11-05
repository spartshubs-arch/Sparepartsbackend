const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const vendorAuthRoutes = require('./routes/vendorAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminProductRoutes = require("./routes/productRoutes");
const carDetailsRoutes = require('./routes/carDetailsRoutes');
const path = require('path');
const passport = require('passport');
require('./config/passport')(passport);
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const callbackRequestRoutes = require("./routes/callbackRequestRoutes");
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const faqRoutes = require('./routes/faqRoutes');
const footerRoutes = require("./routes/footerRoutes");
const helpCenterRoutes = require("./routes/helpCenterRoutes");




dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(cors({
  origin: [
    "https://your-netlify-link.netlify.app",
    "http://localhost:3001"
  ],
  credentials: true,
}));

app.use(express.json());

app.use("/api/products", adminProductRoutes);
app.use('/api/cardetails', carDetailsRoutes);
app.use('/api/vendor', vendorAuthRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/adminSliderRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api", callbackRequestRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about-us', require('./routes/aboutUsRoutes'));
app.use('/api/faqs', faqRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/helpcenter", helpCenterRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



