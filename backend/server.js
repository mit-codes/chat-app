const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "*",
  },
});

require("./controllers/chatController")(io);

// Routes
app.use("/api", require("./routes/main"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
