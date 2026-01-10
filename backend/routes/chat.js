const express = require("express");
const router = express.Router();
const { getChat } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getChat", authMiddleware, getChat);

module.exports = router;
