import jwt from "jsonwebtoken"
export function setToken(user){
    return jwt.sign(user,process.env.SECRET)
}
export function getToken(token){
    return jwt.verify(token,process.env.SECRET)
}
