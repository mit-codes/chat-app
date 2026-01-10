const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/conversation", require("./conversation"));
router.use("/chat", require("./chat"));

module.exports = router;
