import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage, uploadProfile } from "../controller/upload.js";

const uploadRouter = express.Router();

uploadRouter.post("/profile", upload.single("profile"), uploadProfile);

uploadRouter.post("/image", upload.array("image"),uploadImage)

export default uploadRouter;
