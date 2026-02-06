import { getToken } from "../utils/token.js"

export function requireAuth(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "UnAuthorized"
        })

    }

    try {
        const user = getToken(token)
        if (!user) {
            return res.status(401).json({
                message: "Invalid Token"
            })
        }
        req.user = user
        next()

    }
    catch(e){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    }