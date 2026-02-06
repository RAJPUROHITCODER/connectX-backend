import { Router } from "express";
import { handleConversations, updateConversation } from "../controller/conversations.js";
const conversationRouter=Router()

conversationRouter.get("",handleConversations)
conversationRouter.patch("/:id",updateConversation)
export default conversationRouter