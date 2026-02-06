import Message from "../model/message.js";

export async function updateMessage({id,type,url,status}) {
    const result=await Message.findByIdAndUpdate(id,{
        type:type,
        url:url,
        status:status
    },
    {new:true}
    )
    return result
}