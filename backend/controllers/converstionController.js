const Conversation = require("../models/Conversation");
const User = require("../models/User");

module.exports = {
  createPrivate: async (req, res) => {
    try {
      const { myMobile, autherMobile } = req.body;
      const roomId = [myMobile, autherMobile].sort().join("_");
      const conversation = await Conversation.findOne({ roomId });
      if (conversation) {
        return res
          .status(200)
          .json({ message: "Conversation already exists", conversation });
      }
      const newConversation = await Conversation.create({
        roomId,
        members: [myMobile, autherMobile],
        type: "private",
      });
      res.status(201).json({
        message: "Conversation created successfully",
        newConversation,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  createGroup: async (req, res) => {
    try {
      const { name, members, admin } = req.body;

      const roomId = `group_${Date.now()}`;

      const conversation = await Conversation.create({
        roomId,
        name,
        members,
        admin,
        type: "group",
      });
      res
        .status(201)
        .json({ message: "Conversation created successfully", conversation });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getMyConversations: async (req, res) => {
    try {
      const { mobile } = req.user;
      let conversations = await Conversation.find({
        members: { $in: [mobile] }
      });

      conversations = await Promise.all(
        conversations.map(async (conversation) => {
          const otherMember = conversation.members.find((member) => {
            return member !== mobile;
          });
          const user = await User.findOne({ mobile: otherMember });
          if (!user) {
            return {
              id: conversation._id,
              roomId: conversation.roomId,
              members: conversation.members,
              type: conversation.type,
              name: otherMember,
            };
          }
          return {
            id: conversation._id,
            roomId: conversation.roomId,
            members: conversation.members,
            type: conversation.type,
            name: user.username,
          };
        })
      );

      res.status(200).json({
        message: "Conversations fetched successfully",
        conversations,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
