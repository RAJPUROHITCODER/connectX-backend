import Message from "../model/message.js"
import Conversation from "../model/conversations.js"

export async function createMessageService({
        messages,
        message,
        sender,
        receiverId
    }) {
        
    let createdMessages = [];
    if (Array.isArray(messages) && messages.length > 0) {
        createdMessages = await Message.insertMany(
            messages.map((m) => ({
                message: m.message || "",
                sender,
                receiver: receiverId,
                url: m.url,
                type: m.type,
                status:"uploading"
            }))
        );
    }

    if (!messages && message) {
        const msg = await Message.create({
            message,
            sender,
            receiver: receiverId,
            type: "text",
            status:"sent"
        });
        createdMessages.push(msg);
    }

    const lastMsg = createdMessages[createdMessages.length - 1];

    const members = [sender, receiverId];
    const lastMessage= lastMsg.message?lastMsg.message:lastMsg.type
    let conversationDetail = await Conversation.findOneAndUpdate(
        { members: { $all: members } },
        {
            members,
            sender,
            lastMessage: lastMsg.message?lastMsg.message:lastMsg.type,
            lastMessageAt: lastMsg.createdAt
        },
        { new: true }
    );
    if (!conversationDetail) {
        conversationDetail = await Conversation.create({
            members,
            sender,
            lastMessage: lastMsg.message?lastMsg.message:lastMsg.type,
            lastMessageAt: lastMsg.createdAt
        });
    }
    return {
        newMessage:createdMessages,
        conversationDetail:conversationDetail
    }
}
