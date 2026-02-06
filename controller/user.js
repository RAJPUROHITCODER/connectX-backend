import User from "../model/user.js"
import { setToken } from "../utils/token.js"

function validate(email, password) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return "Invalid email"
    }
    if (password.length < 5) {
        return "length of password must be equall or greater than 5"
    }
    return null
}

export async function handleSignUp(req, res) {
    const { fullName, email, password } = req.body
    const boddy = req.body
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "Full Name , email and password required"
        })
    }
    if (await User.findOne({ email: email })) {
        return res.status(409).json({
            message: "User already exist"
        })
    }
    const validateMessage = validate(email, password)
    if (validateMessage) {
        return res.status(404).json({
            message: validateMessage
        })
    }
    await User.create({
        fullName: fullName,
        email: email,
        password: password
    })

    return res.status(201).json({
        message: "Signup successful"
    });
}

export async function handleSignIn(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Email and Password required"
            })
        }
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password required"
            })
        }
        const verfiedUser = await User.matchPasswordAndGenerateToken(email, password)
        const token = setToken(verfiedUser)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        return res.status(200).json({
            user: {
                fullName: verfiedUser.fullName,
                email: verfiedUser.email
            }
        })
    }
    catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

export async function handleUser(req, res) {
    const user = await User.findById(req.user._id);
    return res.send({
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        profile: user.profile
    })
}
export async function handleUserUpdate(req, res) {
    const body = req.body
    await User.updateOne({ email: body.email }, {
        $set: {
            profile: body.profile
        }
    })
    return res.status(201).json({ message: "update successfully" })
}

export async function checkUserExists(req, res) {
    const { email } = req.query;
    const user = await User.findOne({ email }).select("email id fullName")
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
}