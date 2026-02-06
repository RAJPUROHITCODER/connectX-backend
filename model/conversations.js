import {Schema,model} from "mongoose"

const conversationSchema=new Schema({
    members:{
        type:[String],
        required:true
    },
    lastMessage:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    lastMessageAt:{
        type:Date
    }
},
{
    timestamps:true
}
)
const Conversation=model("conversation",conversationSchema)
export default Conversation