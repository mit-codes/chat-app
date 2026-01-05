const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/conversation", require("./conversation"));

module.exports = router;
