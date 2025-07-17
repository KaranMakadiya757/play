import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/fileOperation.js"
import { cookieOption } from "../constants.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendmail.js";
import { welcomeTemplate } from "../Templates/welcomeTemplate.js"

// Register User
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // Deconstruct username and email from request body
    const { email, username } = req.body;

    // CHECK WEATHER USER ALREADY EXISTS AND IF EXISTS THEN THROW NEW ERROR
    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    });

    // Throw error if user already exists
    if (existinguser) throw new ApiError(409, "user with Username or Email exists");



    // GET THE LOCAL FILE PATH FOR THE AVATAR AND THROW ERROR IF AVATAR DOESNOT EXISTS 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // Throw error if Avatar is not Provided
    if (!avatarLocalPath) throw new ApiError(400, "Bad Request", ["Avatar is required"]);

    // UPLOAD THE AVATAR AND COVER IMAGES ON CLOUDINARY AND STORE THE RESPONSE IN VARIABLE AND THROW ERROR IF NO IAMGES EXISTS
    const avatar = await uploadOnCloudinary(avatarLocalPath, "Profile");

    // if avatar is uploaded then save the url in req body otherwise throw error
    if (avatar) {
        req.body.avatar = avatar?.public_id;
    } else {
        throw new ApiError(500, "Something went wrong while uploading Avatar");
    }



    // GET THE LOCAL FILE PATH FOR THE COVERIMAGE IMAGE
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    // if cover image is provided upload it to coludinary 
    if (coverImageLocalPath) {

        const coverimage = await uploadOnCloudinary(coverImageLocalPath, "Profile");

        if (coverimage) {
            req.body.coverimage = coverimage?.public_id;
        } else {
            throw new ApiError(500, "Something went wrong while uploading the cover image");
        }
    }


    // CREATE A NEW USER BASED ON GIVEN DATA AND THE USER SCHEMA
    const user = await User.create(req.body);

    // GET THE CREATED USER WITHOUT THE PASSWORD AND REFERESH FIELDS AND THROW ERROR IF USER DOES NOT EXISTS 
    const createduser = await User.findById(user._id).select("-password -refreshToken");

    // throw error if user is not created
    if (!createduser) throw new ApiError(500, "Internal server error");

    // Send welcome email
    await sendEmail({
        to: user.email,
        subject: "Welcome to Task Manager!",
        html: welcomeTemplate(user.fullname),
    });

    // RETURN THE RESPONSE IF THERE ARE NO ERRORS 
    return res
        .status(201)
        .json(new ApiResponse(200, createduser, "user registered sucessfully"));
})

// Utility Function to create Refresh and Access Tokens
const generateAccessAndRefreshToken = async (user) => {
    try {

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })


        return { accessToken, refreshToken }

    } catch {
        throw new ApiError(500, "Something went wrong while generating the referesh and access tokens")
    }
}

// Login User
const loginUser = asyncHandler(async (req, res) => {

    // GET USERNAME , EMAIL AND PASSWORD FROM THE REQUEST BODY
    const { password, email } = req.body

    // FIND THE USER BY USERNAME OR EMAIL AND THROW ERROR IF USER DOES NOT EXISTS
    const user = await User.findOne({
        $or: [{ email }]
    });

    // Throw error if user does not exist
    if (!user) throw new ApiError(403, "", ["user does not exist"]);



    // CHECK WEATHER THE PASSWORD IS CORRECT AND THROW ERROR IS THE PASSWORD IS INCORRECT
    const isPasswordValid = await user.isPasswordCorrect(password)

    // Throw error
    if (!isPasswordValid) throw new ApiError(401, "Invalid User Credentials");



    // GENERATING THE FERERESH AND ACCESS TOKENS
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

    // GET THE LOGGED IN USER
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // RETURN THE RESPONSE 
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

// Logout
const logoutUser = asyncHandler(async (req, res) => {

    // Find the user by ID and remove refresh Token
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    // Throw Error if User is not created
    if (!updatedUser) throw new ApiError(500, "Inter server error !!!");

    // return response
    return res
        .status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponse(200, {}, "Logged out sucessfully"))

})

// Refresh Access Token
const refereshAccessToken = asyncHandler(async (req, res) => {

    // GET THE TOKEN FROM COOKIES OR REQUEST BODY
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    //  THROW ERROR IF THERE ARE NO TOKENS 
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request");

    //  VERIFY THE TOKEN
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFERSH_TOKEN_SECRET);

    // GET THE USER FROM THE DATABASE
    const user = await User.findById(decodedToken._id);


    //  THROW ERROR UF THERE ARE NO USER ASSOCIATED WITH THE GIVEN REFERESH TOKEN
    if (!user) throw new ApiError(401, "Invalid Referesh token");

    // GENERATE NEW ACCESSTOKEN AND REFRESHTOKEN
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

    // Return Response
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(new ApiResponse(
            200,
            { accessToken, refreshToken },
            "Referesh Token generated sucessfully"
        ))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    // GET THE OLD AND NEW PASSWORD FROM THE REQUEST BODY
    const { oldPassword, newPassword } = req.body;

    // FIND THE USER BY THE USER ID
    const user = await User.findById(req.user?._id);

    // CHECK WEATHER THE OLD PASSWORD IS VALID OR NOT
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    // IF OLD PASSWORD IS NOT VALID THEN THROW NEW ERROR
    if (!isPasswordValid) throw new ApiError(400, "Invalid password");

    //  IF THE PASSWORD IS VALID THEN UPDATE IT IN THE DATABASE
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed sucessfully"))

})

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched sucessfully"))
})

// Update User Details
const updateAccountDetails = asyncHandler(async (req, res) => {

    // Get Avatar and Cover Image Local Path 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    // Throw error if Avatar is not Provided
    if (!avatarLocalPath && !req.body.avatar) throw new ApiError(400, "Bad Request", ["Avatar is required"]);

    // if avatar is provided upload it to coludinary 
    if (avatarLocalPath) {

        const avatar = await uploadOnCloudinary(avatarLocalPath, "Profile");

        if (avatar) {
            req.body.avatar = avatar?.public_id;
            await deleteFromCloudinary(req.user.avatar)
        } else {
            throw new ApiError(500, "Something went wrong while uploading the cover image");
        }
    }

    // if cover image is provided upload it to coludinary 
    if (coverImageLocalPath) {

        const coverimage = await uploadOnCloudinary(coverImageLocalPath, "Profile");

        if (coverimage) {
            req.body.coverimage = coverimage?.public_id;
            await deleteFromCloudinary(req.user.coverimage)
        } else {
            throw new ApiError(500, "Something went wrong while uploading the cover image");
        }
    }

    // Delete cover image if no cover image is provided
    if ((req.body.coverimage)?.trim() === "") {
        await deleteFromCloudinary(req.user.coverimage)
    }


    // FIND THE USER BY THE USER ID AND UPDATE THE INFORMATION
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        req.body,
        {
            new: true,
        }
    ).select("-password -refreshToken")

    //  RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Account details updated sucessfully"))
})

// Get User Channel Info 
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
                    $size: "$subscribedTo"
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
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "data fetched successfully"))
})

// Get Watch History
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
                            owner: { $first: "$owner" }
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

// Delete User
const deleteUser = asyncHandler(async (req, res) => {

    // Delete the user from db
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    // Throw error if video is not found
    if (!deletedUser) throw new ApiError(404, "User not found !!");

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted sucessfully !!"));

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refereshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getUserChannelProfile,
    getWatchHistory,
    deleteUser
}