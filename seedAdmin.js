// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();

// const Admin = require("./models/Admin");

// const seedAdmin = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   const username = "Imdadullah";
//   const password = "spareparts2399"; 
//   const hashed = await bcrypt.hash(password, 10);

//   const exists = await Admin.findOne({ username });
//   if (exists) {
//     console.log("❗Admin already exists.");
//     return process.exit();
//   }

//   await Admin.create({ username, password: hashed });
//   console.log("✅ Super admin created.");
//   process.exit();
// };

// seedAdmin();
