import Conversation from "../model/conversations.js"
import User from "../model/user.js"

export async function handleConversations(req,res){
    const data=await Conversation.find({members:req.user.email}).sort({lastMessageAt:-1})
    // const user=req.user
    let users=data.map((item)=>{
        return item.members[0]==req.user.email?item.members[1]:item.members[0]
    })
    users=await User.find({email:{$in:users}},
        {fullName:1,email:1,profile:1}
    )
    return res.send({data,users})
}

export async function updateConversation(req,res) {
    const {id}=req.params
    const {sender,lastMessage,lastMessageAt}=req.body
    const data=await Conversation.findByIdAndUpdate(id,{
        sender:sender,
        lastMessage:lastMessage,
        lastMessageAt:lastMessageAt
    })
    return res.send(data)
}