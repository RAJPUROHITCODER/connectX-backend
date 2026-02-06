import cloudinary from "../config/cloudinary.js";
import { updateMessage } from "../services/updateMessage.js";

export const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        cloudinary.uploader.upload_stream(
            {
                folder: "chat-app/profile",
                resource_type: "image",
                use_filename: true,
                // unique_filename: true,
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error });
                }

                res.json({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        ).end(req.file.buffer);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const uploadImage = async (req, res) => {

    const  messageIds  = JSON.parse(req.body.messageIds)
    const conversationId=req.body.conversationId
    try {
        if (!req.files || req.files.length == 0) {
            return res.status(400).json({ message: "No files found" })
        }
        const uploadPromises = req.files.map((file, index) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder: "chat-app/image",
                    resource_type: "auto",
                    use_filename: true,
                    unique_filename: true
                },
                    async (error, result) => {
                        if (error) {
                            const response=updateMessage({id:messageIds[index]._id,url:"",status:"failed"})
                            req.io.emit('messageSent',{
                            _id:response._id,
                            status:"failed",
                            url:""
                        })
                            return reject(error)
                        }

                        const response=await updateMessage({id:messageIds[index]._id,type:result.resource_type,url:result.public_id,status:"sent"})
                        req.io.emit('messageSent',{
                            _id:response._id,
                            status:"sent",
                            url:result.public_id
                        })
                        req.io.to(`user_${messageIds[0].receiver}`).emit("receivedMessage", {
                            _id: response._id,
                            from:req.user.email,
                            to: messageIds[0].receiver,
                            message: messageIds[index]["message"]?messageIds[index]["message"]:"",
                            url: result.public_id,
                            type: result.resource_type,
                            createdAt: response.createdAt,
                            conversationId: conversationId,
                            status:"sent"
                        })
                        resolve()

                    }).end(file.buffer)
            })
        })
        const uploadedImages = await Promise.allSettled(uploadPromises)
        return res.status(201).json({ uploadedImages ,conversationId})

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}