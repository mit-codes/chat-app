const Message = require("../models/Messages");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected : ", socket.id);

    socket.on("join-room", (roomId) => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.leave(room);
        }
      }

      socket.join(roomId);
      console.log("joined room : ", roomId);
    });

    socket.on("send-message", async (data) => {
      console.log("data : ", data);
      const msg = await Message.create(data);
      io.to(data.roomId).emit("receive-message", msg);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected : ", socket.id);
    });
  });
};

const getChat = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.query.roomId });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = chatSocket;
module.exports.getChat = getChat;
