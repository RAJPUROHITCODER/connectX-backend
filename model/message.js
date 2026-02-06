import {Schema,model} from "mongoose"

const messageSchema=new Schema({
    message:{
        type:String,
        // required:true
    },
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["text","image","video","file"],
        default:"text"
    },
    url:{
        type:String,
        default:""
    },
    status:{
        type:String,
    }

},
{
    timestamps:true
}
)
const Message=model('message',messageSchema)
export default Message
