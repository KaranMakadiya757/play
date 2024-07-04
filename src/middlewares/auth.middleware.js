import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req,res, next) => {

    try {
        // GET THE ACCESS TOKEN FROM COOKIE OR REQUEST HEADER
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace( "Bearer ", "") 
    
        // THROW ERROR IF THERE IS NO TOKEN
        if(!token){
            throw new ApiError(401, "unauthorized Request")
        }
    
        // VERIFY THE TOKEN
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // GET USER FROM DB
        const user = await User.findById(decodedToken?._id).select("-password -refereshToken")
    
        // THROW NEW IF ACCESS TOKEN IF INVALID 
        if(!user){
            throw new ApiError(401, "invalid Access Token")
        }
    
        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})