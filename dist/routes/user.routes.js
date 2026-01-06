"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../Validations/user.validator");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
// create router instance
const userRouter = (0, express_1.Router)();
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
userRouter.route("/register").post(multer_middleware_1.upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
]), (0, validation_middleware_1.default)(user_validator_1.userValidationSchema), user_controller_1.registerUser);
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
userRouter.route("/login").post((0, validation_middleware_1.default)(user_validator_1.userLoginValidationSchema), user_controller_1.loginUser);
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
userRouter.route("/login/send-otp").post((0, validation_middleware_1.default)(user_validator_1.userLoginWithOtpValidationSchema), user_controller_1.sendOTP);
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
userRouter.route("/login/verify-otp").post((0, validation_middleware_1.default)(user_validator_1.userOtpValidationSchema), user_controller_1.verifyOTP);
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
userRouter.route("/referesh-token").post(user_controller_1.refereshAccessToken);
// SECURED ROUTES
userRouter.use(auth_middleware_1.verifyJWT);
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
userRouter.route("/getcurrentuser").get(user_controller_1.getCurrentUser);
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
userRouter.route("/c/:username").get(user_controller_1.getUserChannelProfile);
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
userRouter.route("/history").get(user_controller_1.getWatchHistory);
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
userRouter.route("/changeaccountdetails").patch(multer_middleware_1.upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
]), (0, validation_middleware_1.default)(user_validator_1.userUpdateValidationSchema), user_controller_1.updateAccountDetails);
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
userRouter.route("/changepassword").patch((0, validation_middleware_1.default)(user_validator_1.changepasswordValidationSchema), user_controller_1.changeCurrentPassword);
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
userRouter.route("/logout").post(user_controller_1.logoutUser);
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
userRouter.route("/").delete(user_controller_1.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map