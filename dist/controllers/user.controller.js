"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getWatchHistory = exports.getUserChannelProfile = exports.updateAccountDetails = exports.getCurrentUser = exports.changeCurrentPassword = exports.refereshAccessToken = exports.logoutUser = exports.verifyOTP = exports.sendOTP = exports.loginUser = exports.registerUser = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const user_model_1 = require("../models/user.model");
const fileOperation_1 = require("../utils/fileOperation");
const constants_1 = require("../constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendmail_1 = require("../utils/sendmail");
const welcomeTemplate_1 = require("../Templates/welcomeTemplate");
const otpTemplate_1 = require("../Templates/otpTemplate");
// Register User
const registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    var _a, _b, _c, _d;
    // Deconstruct username and email from request body
    const { email, username } = req.body;
    // CHECK WEATHER USER ALREADY EXISTS AND IF EXISTS THEN THROW NEW ERROR
    const existinguser = await user_model_1.User.findOne({
        $or: [{ username }, { email }],
    });
    // Throw error if user already exists
    if (existinguser)
        throw new apiError_1.ApiError(409, "user with Username or Email exists");
    // Files
    const Files = req.files;
    // GET THE LOCAL FILE PATH FOR THE AVATAR AND THROW ERROR IF AVATAR DOESNOT EXISTS
    const avatarLocalPath = (_b = (_a = Files === null || Files === void 0 ? void 0 : Files.avatar) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
    // Throw error if Avatar is not Provided
    if (!avatarLocalPath)
        throw new apiError_1.ApiError(400, "Bad Request", ["Avatar is required"]);
    // UPLOAD THE AVATAR AND COVER IMAGES ON CLOUDINARY AND STORE THE RESPONSE IN VARIABLE AND THROW ERROR IF NO IAMGES EXISTS
    const avatar = await (0, fileOperation_1.uploadOnCloudinary)(avatarLocalPath, "Profile");
    // if avatar is uploaded then save the url in req body otherwise throw error
    if (avatar) {
        req.body.avatar = avatar === null || avatar === void 0 ? void 0 : avatar.public_id;
    }
    else {
        throw new apiError_1.ApiError(500, "Something went wrong while uploading Avatar");
    }
    // GET THE LOCAL FILE PATH FOR THE COVERIMAGE IMAGE
    const coverImageLocalPath = (_d = (_c = Files === null || Files === void 0 ? void 0 : Files.coverimage) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
    // if cover image is provided upload it to coludinary
    if (coverImageLocalPath) {
        const coverimage = await (0, fileOperation_1.uploadOnCloudinary)(coverImageLocalPath, "Profile");
        if (coverimage) {
            req.body.coverimage = coverimage === null || coverimage === void 0 ? void 0 : coverimage.public_id;
        }
        else {
            throw new apiError_1.ApiError(500, "Something went wrong while uploading the cover image");
        }
    }
    // CREATE A NEW USER BASED ON GIVEN DATA AND THE USER SCHEMA
    const user = await user_model_1.User.create(req.body);
    // GET THE CREATED USER WITHOUT THE PASSWORD AND REFERESH FIELDS AND THROW ERROR IF USER DOES NOT EXISTS
    const createduser = await user_model_1.User.findById(user._id).select("-password -refreshToken -otp -otp_expiry");
    // throw error if user is not created
    if (!createduser)
        throw new apiError_1.ApiError(500, "Internal server error");
    // Send welcome email
    await (0, sendmail_1.sendEmail)({
        to: user.email,
        subject: "Welcome to PlayTube!",
        html: (0, welcomeTemplate_1.welcomeTemplate)(user.fullname),
    });
    // RETURN THE RESPONSE IF THERE ARE NO ERRORS
    return res.status(201).json(new apiResponse_1.ApiResponse(200, createduser, "user registered sucessfully"));
});
exports.registerUser = registerUser;
// Utility Function to create Refresh and Access Tokens
// const generateAccessAndRefreshToken = async (user) => {
//     try {
//         const accessToken = await user.generateAccessToken();
//         const refreshToken = await user.generateRefreshToken();
//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false });
//         return { accessToken, refreshToken };
//     } catch {
//         throw new ApiError(500, "Something went wrong while generating the referesh and access tokens");
//     }
// };
// Login User
const loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // GET USERNAME , EMAIL AND PASSWORD FROM THE REQUEST BODY
    const { password, email } = req.body;
    // FIND THE USER BY USERNAME OR EMAIL AND THROW ERROR IF USER DOES NOT EXISTS
    const user = await user_model_1.User.findOne({
        $or: [{ email }],
    });
    // Throw error if user does not exist
    if (!user)
        throw new apiError_1.ApiError(403, "", ["user does not exist"]);
    // CHECK WEATHER THE PASSWORD IS CORRECT AND THROW ERROR IS THE PASSWORD IS INCORRECT
    const isPasswordValid = await user.isPasswordCorrect(password);
    // Throw error
    if (!isPasswordValid)
        throw new apiError_1.ApiError(401, "Invalid User Credentials");
    // GENERATING THE FERERESH AND ACCESS TOKENS
    const { accessToken, refreshToken } = await user.generateAccessAndRefreshTokens();
    // GET THE LOGGED IN USER
    const loggedInUser = await user_model_1.User.findById(user._id).select("-password -refreshToken -otp -otp_expiry");
    // RETURN THE RESPONSE
    return res
        .status(200)
        .cookie("accessToken", accessToken, constants_1.cookieOption)
        .cookie("refreshToken", refreshToken, constants_1.cookieOption)
        .json(new apiResponse_1.ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
    }, "User Logged In Successfully"));
});
exports.loginUser = loginUser;
// Send OTP
const sendOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // GET USERNAME , EMAIL AND PASSWORD FROM THE REQUEST BODY
    const { email } = req.body;
    // FIND THE USER BY USERNAME OR EMAIL AND THROW ERROR IF USER DOES NOT EXISTS
    const user = await user_model_1.User.findOne({
        $or: [{ email }],
    });
    // Throw error if user does not exist
    if (!user)
        throw new apiError_1.ApiError(403, "", ["user does not exist"]);
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // set otp and otp expiry in the user model
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
    // Send otp in the mail
    await (0, sendmail_1.sendEmail)({
        to: user.email,
        subject: "OTP for playtube login!",
        html: (0, otpTemplate_1.otpTemplate)(user.fullname, otp),
    });
    // Save user model
    await user.save();
    // RETURN THE RESPONSE
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "OTP sent successfully !! Check your registered Email for the same"));
});
exports.sendOTP = sendOTP;
// Verify OTP
const verifyOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // GET USERNAME , EMAIL AND PASSWORD FROM THE REQUEST BODY
    const { email, otp } = req.body;
    // FIND THE USER BY USERNAME OR EMAIL AND THROW ERROR IF USER DOES NOT EXISTS
    const user = await user_model_1.User.findOne({
        $or: [{ email }],
    });
    // Throw error if user does not exist
    if (!user)
        throw new apiError_1.ApiError(403, "", ["user does not exist"]);
    // CHECK WEATHER THE OTP IS CORRECT AND THROW ERROR IS THE PASSWORD IS INCORRECT
    const isOTPValid = await user.isOtpCorrect(otp.toString());
    // Throw error
    if (!isOTPValid)
        throw new apiError_1.ApiError(401, "Invalid OTP !!!");
    // GENERATING THE FERERESH AND ACCESS TOKENS
    const { accessToken, refreshToken } = await user.generateAccessAndRefreshTokens();
    // Remove the OTP and OTP expiry from db
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();
    // GET THE LOGGED IN USER
    const loggedInUser = await user_model_1.User.findById(user._id).select("-password -refreshToken -otp -otp_expiry");
    // RETURN THE RESPONSE
    return res
        .status(200)
        .cookie("accessToken", accessToken, constants_1.cookieOption)
        .cookie("refreshToken", refreshToken, constants_1.cookieOption)
        .json(new apiResponse_1.ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
    }, "OTP Verified !!! Logged in Successfully"));
});
exports.verifyOTP = verifyOTP;
// Logout
const logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Find the user by ID and remove refresh Token
    const updatedUser = await user_model_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        $unset: {
            refreshToken: 1,
        },
    }, {
        new: true,
    });
    // Throw Error if User is not created
    if (!updatedUser)
        throw new apiError_1.ApiError(500, "Inter server error !!!");
    // return response
    return res
        .status(200)
        .clearCookie("accessToken", constants_1.cookieOption)
        .clearCookie("refreshToken", constants_1.cookieOption)
        .json(new apiResponse_1.ApiResponse(200, {}, "Logged out sucessfully"));
});
exports.logoutUser = logoutUser;
// Refresh Access Token
const refereshAccessToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // GET THE TOKEN FROM COOKIES OR REQUEST BODY
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    //  THROW ERROR IF THERE ARE NO TOKENS
    if (!incomingRefreshToken)
        throw new apiError_1.ApiError(401, "Unauthorized Request");
    //  VERIFY THE TOKEN
    const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, (_a = process.env.REFERSH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : "");
    // GET THE USER FROM THE DATABASE
    const user = await user_model_1.User.findById(decodedToken._id);
    //  THROW ERROR UF THERE ARE NO USER ASSOCIATED WITH THE GIVEN REFERESH TOKEN
    if (!user)
        throw new apiError_1.ApiError(401, "Invalid Referesh token");
    // GENERATE NEW ACCESSTOKEN AND REFRESHTOKEN
    const { accessToken, refreshToken } = await user.generateAccessAndRefreshTokens();
    // Return Response
    return res
        .status(200)
        .cookie("accessToken", accessToken, constants_1.cookieOption)
        .cookie("refreshToken", refreshToken, constants_1.cookieOption)
        .json(new apiResponse_1.ApiResponse(200, { accessToken, refreshToken }, "Referesh Token generated sucessfully"));
});
exports.refereshAccessToken = refereshAccessToken;
const changeCurrentPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // GET THE OLD AND NEW PASSWORD FROM THE REQUEST BODY
    const { oldPassword, newPassword } = req.body;
    // FIND THE USER BY THE USER ID
    const user = await user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    // throw error
    if (!user)
        throw new apiError_1.ApiError(404, "User not found");
    // CHECK WEATHER THE OLD PASSWORD IS VALID OR NOT
    const isPasswordValid = await (user === null || user === void 0 ? void 0 : user.isPasswordCorrect(oldPassword));
    // IF OLD PASSWORD IS NOT VALID THEN THROW NEW ERROR
    if (!isPasswordValid)
        throw new apiError_1.ApiError(400, "Invalid password");
    //  IF THE PASSWORD IS VALID THEN UPDATE IT IN THE DATABASE
    user.password = newPassword;
    await (user === null || user === void 0 ? void 0 : user.save({ validateBeforeSave: false }));
    // RETURN THE RESPONSE
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "Password Changed sucessfully"));
});
exports.changeCurrentPassword = changeCurrentPassword;
// Get Current User
const getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    return res.status(200).json(new apiResponse_1.ApiResponse(200, req.user, "User fetched sucessfully"));
});
exports.getCurrentUser = getCurrentUser;
// Update User Details
const updateAccountDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Files
    const Files = req.files;
    // Get Avatar and Cover Image Local Path
    const avatarLocalPath = (_b = (_a = Files === null || Files === void 0 ? void 0 : Files.avatar) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
    const coverImageLocalPath = (_d = (_c = Files === null || Files === void 0 ? void 0 : Files.coverimage) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
    // Throw error if Avatar is not Provided
    if (!avatarLocalPath && !req.body.avatar)
        throw new apiError_1.ApiError(400, "Bad Request", ["Avatar is required"]);
    // if avatar is provided upload it to coludinary
    if (avatarLocalPath) {
        const avatar = await (0, fileOperation_1.uploadOnCloudinary)(avatarLocalPath, "Profile");
        if (avatar) {
            req.body.avatar = avatar === null || avatar === void 0 ? void 0 : avatar.public_id;
            await (0, fileOperation_1.deleteFromCloudinary)((_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.avatar) !== null && _f !== void 0 ? _f : "");
        }
        else {
            throw new apiError_1.ApiError(500, "Something went wrong while uploading the cover image");
        }
    }
    // if cover image is provided upload it to coludinary
    if (coverImageLocalPath) {
        const coverimage = await (0, fileOperation_1.uploadOnCloudinary)(coverImageLocalPath, "Profile");
        if (coverimage) {
            req.body.coverimage = coverimage === null || coverimage === void 0 ? void 0 : coverimage.public_id;
            await (0, fileOperation_1.deleteFromCloudinary)((_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.coverimage) !== null && _h !== void 0 ? _h : "");
        }
        else {
            throw new apiError_1.ApiError(500, "Something went wrong while uploading the cover image");
        }
    }
    // Delete cover image if no cover image is provided
    if (((_j = req.body.coverimage) === null || _j === void 0 ? void 0 : _j.trim()) === "") {
        await (0, fileOperation_1.deleteFromCloudinary)((_l = (_k = req.user) === null || _k === void 0 ? void 0 : _k.coverimage) !== null && _l !== void 0 ? _l : "");
    }
    // FIND THE USER BY THE USER ID AND UPDATE THE INFORMATION
    const user = await user_model_1.User.findByIdAndUpdate((_m = req.user) === null || _m === void 0 ? void 0 : _m._id, req.body, {
        new: true,
    }).select("-password -refreshToken -otp -otp_expiry");
    //  RETURN THE RESPONSE
    return res.status(200).json(new apiResponse_1.ApiResponse(200, { user }, "Account details updated sucessfully"));
});
exports.updateAccountDetails = updateAccountDetails;
// Get User Channel Info
const getUserChannelProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // GET THE USERNAME FROM THE REQUEST PARAMETER
    const { username } = req.params;
    // THROW ERROR IF THERE ARE NO USERNAME
    if (!(username === null || username === void 0 ? void 0 : username.trim())) {
        throw new apiError_1.ApiError(400, "username is missing");
    }
    // APPLY AGGERATE PIPELINE IN THE DB AND CREATE A CHANNEL OBJECT
    const channel = await user_model_1.User.aggregate([
        {
            $match: {
                username: username === null || username === void 0 ? void 0 : username.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers",
                },
                channelCount: {
                    $size: "$subscribedTo",
                },
                isubscribed: {
                    $cond: {
                        if: { $in: [(_a = req.user) === null || _a === void 0 ? void 0 : _a._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false,
                    },
                },
            },
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
                email: 1,
            },
        },
    ]);
    // THROW ERROR IF THERE ARE NO CHANNEL
    if (!(channel === null || channel === void 0 ? void 0 : channel.length)) {
        throw new apiError_1.ApiError(404, "channel does not exists");
    }
    // RETURN THE RESPONSE
    return res.status(200).json(new apiResponse_1.ApiResponse(200, channel[0], "data fetched successfully"));
});
exports.getUserChannelProfile = getUserChannelProfile;
// Get Watch History
const getWatchHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const user = await user_model_1.User.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
            },
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
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                        },
                    },
                ],
            },
        },
    ]);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, user[0].watchHistory, "Watch History Fetched sucessfully"));
});
exports.getWatchHistory = getWatchHistory;
// Delete User
const deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Delete the user from db
    const deletedUser = await user_model_1.User.findByIdAndDelete((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    // Throw error if video is not found
    if (!deletedUser)
        throw new apiError_1.ApiError(404, "User not found !!");
    // return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "User deleted sucessfully !!"));
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map