import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto"
import { setToken } from "../utils/token.js";
const userSchema = new Schema({
   fullName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique:true
   },
   salt: {
      type: String,
   },
   password: {
      type: String,
      required: true
   },
   profile:{
      type:String,
      default:"chat-app/profile/file_bc2k2q.png"
   }
},
   {
      timestamps: true
   }
)
userSchema.pre("save", async function () {
   const user = this
   if (!user.isModified("password")) return;
   try {
      const salt = randomBytes(16).toString("hex")
      const hashedPassword = createHmac("sha256", salt)
         .update(user.password)
         .digest("hex")
      this.salt = salt
      this.password = hashedPassword
   }
   catch (error) {
      throw new Error(error)
   }
})

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
   const user = await this.findOne({ email: email })
   if (!user) throw new Error("user not found")
   const salt = user.salt
   const hashedPassword = user.password
   const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex")
   if (hashedPassword !== userProvidedHash) throw new Error("Invalid Password")
   
   const verifiedUser = { ...user._doc, password: undefined, salt: undefined }
   return verifiedUser
})

const User = model("user", userSchema)
export default User