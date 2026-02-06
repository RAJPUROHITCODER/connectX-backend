import Conversation from "../model/conversations.js"
import Message from "../model/message.js"
import { createMessageService } from "../services/messsageService.js"

export async function handleMessage(req, res) {
    const { receiverId } = req.params
    const messages = await Message.find({ $or: [{ sender: req.user.email, receiver: receiverId }, { sender: receiverId, receiver: req.user.email }] }).sort({ createdAt: 1 })
    const user = req.user
    return res.send({ user, messages })
}
export async function sendMessage(req, res) {
    const {receiverId}=req.params
    const result=await createMessageService({
        messages:req.body.messages,
        message:req.body.message,
        sender:req.user.email,
        receiverId:receiverId,

    })
    return res.status(200).json(result)
}

export async function deleteMessage(req, res) {
    const { ids } = req.body
    await Message.deleteMany({
        _id: { $in: ids }
    })
    return res.status(200).json({ success: true })

}