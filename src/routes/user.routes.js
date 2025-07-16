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
    refereshAccessToken,
    deleteUser
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

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: Password@123
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverimage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */

// Reigster user
userRouter.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    validate(userValidationSchema),
    registerUser
)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: User does not exist
 */

// Login 
userRouter.route("/login").post(validate(userLoginValidationSchema), loginUser)

/**
 * @swagger
 * /user/referesh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: <refresh_token>
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized request
 */

// Refresh Access Token
userRouter.route("/referesh-token").post(refereshAccessToken)

// SECURED ROUTES
userRouter.use(verifyJWT)

/**
 * @swagger
 * /user/changeaccountdetails:
 *   patch:
 *     summary: Update user account details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverimage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Account details updated successfully
 *       400:
 *         description: Bad request
 */

// Update User Details
userRouter.route("/changeaccountdetails").patch(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    validate(userUpdateValidationSchema),
    updateAccountDetails
)

/**
 * @swagger
 * /user/getcurrentuser:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Unauthorized
 */

// Get Current User Information
userRouter.route("/getcurrentuser").get(getCurrentUser)

/**
 * @swagger
 * /user/c/{username}:
 *   get:
 *     summary: Get channel information by channel name
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Channel username
 *     responses:
 *       200:
 *         description: Channel information fetched successfully
 *       404:
 *         description: Channel does not exist
 */

// Get Channel Information By Channel Name
userRouter.route("/c/:username").get(getUserChannelProfile)

/**
 * @swagger
 * /user/history:
 *   get:
 *     summary: Get user watch history
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Watch history fetched successfully
 *       401:
 *         description: Unauthorized
 */

// Get Watch History
userRouter.route("/history").get(getWatchHistory)

/**
 * @swagger
 * /user/changepassword:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword@123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password
 */

// Change Password
userRouter.route("/changepassword").patch(validate(changepasswordValidationSchema), changeCurrentPassword)

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Internal server error
 */

// Logout
userRouter.route("/logout").post(logoutUser)

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

// Delete User By ID
userRouter.route("/").delete(deleteUser);

export default userRouter;