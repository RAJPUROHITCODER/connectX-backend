import { Router } from "express";
import { deleteMessage, handleMessage, sendMessage } from "../controller/message.js";
const messageRouter=Router()

messageRouter.get("/:receiverId",handleMessage)
messageRouter.post("/:receiverId",sendMessage)
messageRouter.delete("/",deleteMessage)
export default messageRouter