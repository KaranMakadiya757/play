import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/fileUpload.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body

    // THROW ERROR IF ANY OF THE GIVEN FEILD ARE EMPTY 
    if ([fullname, username, email, password].some(i => i.trim() === "")) {
        throw new ApiError(400, "All fileds are required")
    }



    // CHECK WEATHER USER ALREADY EXISTS AND IF EXISTS THEN THROW NEW ERROR
    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existinguser) {
        throw new ApiError(409, "user with Username or Email exists")
    }


    // GET THE LOCAL FILE PATH FOR THE AVATAR AND COVERIMAGE IMAGE AND THROW ERROR IF AVATAR DOESNOT EXISTS 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }



    // UPLOAD THE AVATAR AND COVER IMAGES ON CLOUDINARY AND STORE THE RESPONSE IN VARIABLE AND THROW ERROR IF NO IAMGES EXISTS
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }



    // CREATE A NEW USER BASED ON GIVEN DATA AND THE USER SCHEMA
    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
    })

    console.log("created user", user)

    // GET THE CREATED USER WITHOUT THE PASSWORD AND REFERESH FIELDS AND THROW ERROR IF USER DOES NOT EXISTS 
    const createduser = await User.findById(user._id).select(
        "-password -refereshToken"
    )

    if (!createduser) {
        throw new ApiError(500, "server error")
    }


    // RETURN THE RESPONSE IF THERE ARE NO ERRORS 
    return res.status(201).json(
        new ApiResponse(200, createduser, "user registered sucessfully")
    )
})

const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refereshToken = await user.generateRefershToken()


        user.refereshToken = refereshToken
        await user.save({ validateBeforeSave: false })


        return { accessToken, refereshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the referesh and access tokens")
    }
}

const loginUser = asyncHandler(async (req, res) => {

    // GET USERNAME , EMAIL AND PASSWORD FROM THE REQUEST BODY
    const { username, password, email } = req.body

    // THROW NEW ERROR IF THE USERNAME OR EMAIL DOESNOT EXISTS IN REQUEST BODY
    if (!username && !email) {
        throw new ApiError(400, "username or email are required")
    }

    
    // FIND THE USER BY USERNAME OR EMAIL AND THROW ERROR IF USER DOES NOT EXISTS
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(400, "user doesn't exist")
    }

    // CHECK WEATHER THE PASSWORD IS CORRECT AND THROW ERROR IS THE PASSWORD IS INCORRECT
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }


    // GENERATING THE FERERESH AND ACCESS TOKENS
    const { accessToken, refereshToken } = await generateAccessAndRefereshToken(user._id)

    // GET THE LOGGED IN USER
    const loggedInUser = await User.findById(user._id).select("-password -refereshToken")

    // CREATE THE COOKIE 
    const options = {
        httpOnly: true,
        secure: true
    }

    // RETURN THE RESPONSE 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refereshToken", refereshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refereshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refereshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refereshToken", options)
        .json(new ApiResponse(200, {}, "Logged out sucessfully"))

})

const refereshAccessToken = asyncHandler(async (req, res) => {

    // GET THE TOKEN FROM COOKIES OR REQUEST BODY
    const incomingRefereshToken = req.cookies.refereshToken || req.body.refereshToken

    //  THROW ERROR IF THERE ARE NO TOKENS 
    if (!incomingRefereshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        //  VERIFY THE TOKEN
        const decodedToken = jwt.verify(incomingRefereshToken, process.env.REFERSH_TOKEN_SECRET)

        // GET THE USER FROM THE DATABASE
        const user = await User.findById(decodedToken._id)


        //  THROW ERROR UF THERE ARE NO USER ASSOCIATED WITH THE GIVEN REFERESH TOKEN
        if (!user) {
            throw new ApiError(401, "Invalid Referesh token")
        }


        // CHECK WEATHER INCOMING REFERESH TOKEN AND REFERESH TOKEN STORED IN DB ARE SAME OR NOT
        if (incomingRefereshToken !== user?.refereshToken) {
            throw new ApiError(401, "Referesh Token expired or used")
        }

        // GENERATE NEW ACCESSTOKEN AND REFERESHTOKEN
        const { accessToken, newrefereshToken } = await generateAccessAndRefereshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refereshToken", newrefereshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refereshToken: newrefereshToken },
                "Referesh Token generated sucessfully"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid referesh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    // GET THE OLD AND NEW PASSWORD FROM THE REQUEST BODY
    const { oldPassword, newPassword } = req.body

    // FIND THE USER BY THE USER ID
    const user = await User.findById(req.user?._id)

    // CHECK WEATHER THE OLD PASSWORD IS VALID OR NOT
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    // IF OLD PASSWORD IS NOT VALID THEN THROW NEW ERROR
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    //  IF THE PASSWORD IS VALID THEN UPDATE IT IN THE DATABASE
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed sucessfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched sucessfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {

    // GET THE FULLNAME AND EMAIL FROM THE REQUEST BODY
    const { fullname, email } = req.body

    //  THROW ERROR IF THERE ARE NO FULLNAME OR EMAIL
    if (!fullname || !email) {
        throw new ApiError(400, "all fields are required")
    }

    // FIND THE USER BY THE USER ID AND UPDATE THE INFORMATION
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { fullname, email }
        },
        {
            new: true,
        }
    ).select("-password")

    //  RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Account details updated sucessfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {

    // GET THE LOCAL FILE PATH OF AVATAR GIVEN BY MULTER MIDDLEWARE
    const avataeLocalpath = req.file?.path

    // THROW ERROR IF THERE ARE NO FILES 
    if (!avataeLocalpath) {
        throw new ApiError(400, "Please upload avatar image")
    }

    // UPLOAD THE IMAGE ON CLOUDINARY
    const avatar = await uploadOnCloudinary(avataeLocalpath)

    // THROW ERROR IF THERRE ARE ANY ERROR WHILE UPLOADING THE IMAGE
    if (!avatar.url) {
        throw new ApiError(400, "Avatar upload failed")
    }

    // FIND THE USER BY THE USER ID AND UPDATE THE AVTAR IMAGE
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }
        },
        {
            new: true,
        }
    ).select("-password -refereshToken")

    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated sucessfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    // GET THE LOCAL FILE PATH OF COVER IMAGE GIVEN BY MULTER MIDDLEWARE
    const coverImageLocalPath = req.file?.path

    // THROW ERROR IF THERE ARE NO FILES
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Please upload Cover image")
    }

    // UPLOAD THE IMAGE ON CLOUDINARY
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // THROW ERROR IF THERRE ARE ANY ERROR WHILE UPLOADING THE IMAGE
    if (!coverImage.url) {
        throw new ApiError(400, "Cover Image upload failed")
    }

    // FIND THE USER BY THE USER ID AND UPDATE THE COVER IMAGE
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverimage: coverImage.url }
        },
        {
            new: true,
        }
    ).select("-password -refereshToken")

    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image updated sucessfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    // GET THE USERNAME FROM THE REQUEST PARAMETER
    const { username } = req.params

    // THROW ERROR IF THERE ARE NO USERNAME
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    // APPLY AGGERATE PIPELINE IN THE DB AND CREATE A CHANNEL OBJECT 
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelCount: {
                    $size: "$subscribers"
                },
                isubscribed: {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelCount: 1,
                isubscribed: 1,
                avatar: 1,
                coverimage: 1,
                email: 1
            }
        }
    ])
    
    // THROW ERROR IF THERE ARE NO CHANNEL 
    if(!channel?.length){
        throw new ApiError(404, "channel does not exists")
    }

    // RETURN THE RESPONSE
    return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "data fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req, res) => {
    
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {$first: "$owner"}
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched sucessfully"
    ))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refereshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}