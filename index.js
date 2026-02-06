import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import { requireAuth } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import conversationRouter from "./routes/conversation.js";
import messageRouter from "./routes/message.js";
import { Server } from "socket.io";
import http from "http"
import cors from "cors";
import connectDB from "./config/db.js"
import path from "path"
import uploadRouter from "./routes/upload.js";

dotenv.config();
connectDB()
const app = express();
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}));

const server = http.createServer(app)
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})


app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`)
  })

  socket.on("sendMessage", ({ _id, from, to, message, createdAt, conversationId }) => {
    io.to(`user_${to}`).emit("receivedMessage", {
      _id: _id,
      to: to,
      from: from,
      message: message,
      createdAt: createdAt,
      conversationId
    })
  })

  socket.on("deleteMessage", ({ _id, to, from, selectedMessageIds, isLastMessage, lastMessage, createdAt }) => {
    io.to(`user_${to}`).emit("messageDeleted", ({
      _id: _id,
      selectedMessageIds: selectedMessageIds,
      to: to,
      from: from,
      isLastMessage: isLastMessage,
      createdAt: createdAt,
      lastMessage: lastMessage
    }))
  })
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/user", userRouter)

app.use("/message", requireAuth, messageRouter)

app.use("/conversations", requireAuth, conversationRouter)

app.use("/upload", requireAuth, uploadRouter)

const port=process.env.PORT
server.listen(port, () => {
  console.log("Server started on port ",port);
});