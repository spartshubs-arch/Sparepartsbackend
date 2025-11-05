const express = require("express");
const router = express.Router();
const { createCallbackRequest, getAllCallbackRequests, deleteCallbackRequest } = require("../controllers/callbackRequestController");

router.post("/callback-request", createCallbackRequest);
router.get("/callback-requests", getAllCallbackRequests);
router.delete("/callback-request/:id", deleteCallbackRequest);

module.exports = router;
