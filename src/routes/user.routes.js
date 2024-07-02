import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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

export default userRouter;