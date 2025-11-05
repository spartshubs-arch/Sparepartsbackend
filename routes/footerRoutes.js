const express = require("express");
const { getFooter, updateFooter } = require("../controllers/footerController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFooter);
router.put("/", authenticateJWT, updateFooter);

module.exports = router;
