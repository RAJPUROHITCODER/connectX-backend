import path from "path";
import { checkUserExists, handleSignIn, handleSignUp, handleUser, handleUserUpdate } from "../controller/user.js";
import express from "express"
import { requireAuth } from "../middleware/auth.js";

const userRouter=express.Router()

userRouter.post("/signin",handleSignIn)

userRouter.post("/signup",handleSignUp)

userRouter.get("/by-email/",checkUserExists);

userRouter.get("/me",requireAuth,handleUser)

userRouter.patch("/me",requireAuth,handleUserUpdate)

export default userRouter