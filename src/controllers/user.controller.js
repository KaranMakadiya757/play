import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/fileUpload.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body

    if ([fullname, username, email, password].some(i => i.trim() === "")) {
        throw new ApiError(400, "All fileds are required")
    }

    const existinguser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existinguser) {
        throw new ApiError(409, "user with Username or Email exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullname,
        username: username.toLowercase(),
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500, "server error")
    }


    return res.status(201).json(
        new ApiResponse(200, createduser, "user registered sucessfully")
    )
})

export { registerUser }