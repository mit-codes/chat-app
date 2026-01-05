const Message = require("../models/Messages");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("scoket connected : ", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log("joined room : ", room);
    });

    socket.on("send-message", async (data) => {
      const msg = await Message.create({
        room: data.room,
        sender: data.sender,
        message: data.message,
      });
      io.to(data.room).emit("receive-message", msg);
    });

    socket.on("disconnect", () => {
      console.log("scoket disconnected : ", socket.id);
    });
  });
};
