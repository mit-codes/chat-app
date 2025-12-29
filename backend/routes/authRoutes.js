const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Verify Token Route (Optional, for frontend check)
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});

module.exports = router;
