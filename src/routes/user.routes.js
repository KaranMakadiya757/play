import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { refereshAccessToken } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register")
    .post(
        upload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'coverimage', maxCount: 1 }
        ]),
        registerUser
    )

userRouter.route("/login").post(loginUser)


// SECURED ROUTES
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/referesh-token").post(refereshAccessToken)

userRouter.route("/getcurrentuser").get(verifyJWT, getCurrentUser)
userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile)
userRouter.route("/history").get(verifyJWT, getWatchHistory)

userRouter.route("/changeaccountdetails").patch(verifyJWT, updateAccountDetails)
userRouter.route("/changepassword").patch(verifyJWT, changeCurrentPassword)
userRouter.route("/changeavatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route("/changecoverimage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)


export default userRouter;