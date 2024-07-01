import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/fileUpload.js"

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

    // GET THE CREATED USER WITHOUT THE PASSWORD AND REFERESH FIELDS AND THROW ERROR IF USER DOES NOT EXISTS 
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
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
    console.log(req.body)


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
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User Credentials")
    }


    // GENERATING THE FERERESH AND ACCESS TOKENS
    const { accessToken, refereshToken } = await generateAccessAndRefereshToken(user._id)

    // GET THE LOGGED IN USER
    const loggedInUser = await User.findById(user._id).select("-password -referefereshToken")

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
            $set: {
                refereshToken: undefined
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
    .json( new ApiResponse(200, {}, "Logged out sucessfully"))

})

export { registerUser, loginUser, logoutUser }