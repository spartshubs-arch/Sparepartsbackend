
const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    req.decodedToken = decoded;
    req.userType = null;

    // Admin token
    if (decoded.adminId) {
      req.adminId = decoded.adminId;
      req.userType = "admin";
    }
    // Vendor token
    else if (decoded.vendorId) {
      req.vendorId = decoded.vendorId;
      req.userType = "vendor";
    }
    // Super admin token
    else if (decoded.superAdminId) {
      req.superAdminId = decoded.superAdminId;
      req.userType = "superadmin";
    }
    // Normal user token
    else if (decoded.id) {
      req.userId = decoded.id;
      req.userType = "user";
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("JWT auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
