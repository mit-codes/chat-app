const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    type: { type: String, enum: ["private", "group"], required: true },
    members: [{ type: String, required: true }],
    admin: String,
    groupName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
