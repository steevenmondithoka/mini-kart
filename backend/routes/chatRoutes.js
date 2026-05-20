const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../controllers/chatController");

router.post("/", getChatResponse); // This creates http://localhost:5000/api/chat

module.exports = router;