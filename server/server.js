import dotenv from "dotenv";
dotenv.config({path: "./server/.env"});
import app from "./app.js"
import http from "http"
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});