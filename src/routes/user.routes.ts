import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
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
    deleteUser,
    sendOTP,
    verifyOTP,
} from "../controllers/user.controller";

import {
    changepasswordValidationSchema,
    userLoginValidationSchema,
    userLoginWithOtpValidationSchema,
    userOtpValidationSchema,
    userUpdateValidationSchema,
    userValidationSchema,
} from "../Validations/user.validator";

import validate from "../middlewares/validation.middleware";

// create router instance
const userRouter = Router();

/** Reigster user
 *
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/RegisterResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 */
userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    validate(userValidationSchema),
    registerUser
);

/** Login
 *
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LoginResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
userRouter.route("/login").post(validate(userLoginValidationSchema), loginUser);

/** Send OTp
 * @swagger
 * /user/login/send-otp:
 *   post:
 *     summary: Send OTP to user email for login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SendOtpResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
userRouter.route("/login/send-otp").post(validate(userLoginWithOtpValidationSchema), sendOTP);

/** Verify OTP
 * @swagger
 * /user/login/verify-otp:
 *   post:
 *     summary: Verify OTP for user login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/VerifyOtpResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
userRouter.route("/login/verify-otp").post(validate(userOtpValidationSchema), verifyOTP);

/** Refresh Access Token
 * @swagger
 * /user/referesh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
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
 *         $ref: '#/components/responses/RefreshTokenResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
userRouter.route("/referesh-token").post(refereshAccessToken);

// SECURED ROUTES
userRouter.use(verifyJWT);

/** Get Current User Information
 *
 * @swagger
 * /user/getcurrentuser:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetCurrentUserResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
userRouter.route("/getcurrentuser").get(getCurrentUser);

/** Get Channel Information By Channel Name
 *
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
 *         $ref: '#/components/responses/GetChannelProfileResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
userRouter.route("/c/:username").get(getUserChannelProfile);

/** Get Watch History
 * @swagger
 * /user/history:
 *   get:
 *     summary: Get user watch history
 *     tags: [User]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetWatchHistoryResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
userRouter.route("/history").get(getWatchHistory);

/** Update User Details
 *
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
 *             $ref: '#/components/schemas/UpdateAccountDetailsRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateAccountDetailsResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
userRouter.route("/changeaccountdetails").patch(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    validate(userUpdateValidationSchema),
    updateAccountDetails
);

/** Change Password
 *
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
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ChangePasswordResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
userRouter.route("/changepassword").patch(validate(changepasswordValidationSchema), changeCurrentPassword);

/** Logout
 *
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LogoutResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
userRouter.route("/logout").post(logoutUser);

/** Delete User By ID
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteUserResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
userRouter.route("/").delete(deleteUser);

export default userRouter;
