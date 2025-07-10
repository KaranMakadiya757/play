import { Router } from "express";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    registerUser,
    updateAccountDetails,
    refereshAccessToken
} from "../controllers/user.controller.js";

import {
    changepasswordValidationSchema,
    userLoginValidationSchema,
    userUpdateValidationSchema,
    userValidationSchema
} from "../Validations/user.validator.js";

import validate from "../middlewares/validation.middleware.js";

// create router instance
const userRouter = Router();

// Reigster user
userRouter.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    validate(userValidationSchema),
    registerUser
)

// Login 
userRouter.route("/login").post(validate(userLoginValidationSchema), loginUser)

// Refresh Access Token
userRouter.route("/referesh-token").post(refereshAccessToken)

// SECURED ROUTES
userRouter.use(verifyJWT)

// Update User Details
userRouter.route("/changeaccountdetails").patch(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    validate(userUpdateValidationSchema),
    updateAccountDetails
)

// Get Current User Information
userRouter.route("/getcurrentuser").get(getCurrentUser)

// Get Channel Information By Channel Name
userRouter.route("/c/:username").get(getUserChannelProfile)

// Get Watch History
userRouter.route("/history").get(getWatchHistory)

// Change Password
userRouter.route("/changepassword").patch(validate(changepasswordValidationSchema), changeCurrentPassword)

// Logout
userRouter.route("/logout").post(logoutUser)

export default userRouter;