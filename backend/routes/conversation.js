const express = require("express");
const router = express.Router();
const {
  createPrivate,
  createGroup,
  getMyConversations,
  allUser,
} = require("../controllers/converstionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-private", createPrivate);
router.post("/create-group", createGroup);
router.get("/getMyConversations", authMiddleware, getMyConversations);
router.get("/allUser", authMiddleware, allUser);

module.exports = router;
