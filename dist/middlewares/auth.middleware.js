"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    var _a, _b, _c;
    try {
        // GET THE ACCESS TOKEN FROM COOKIE OR REQUEST HEADER
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        // THROW ERROR IF THERE IS NO TOKEN
        if (!token) {
            throw new apiError_1.ApiError(401, "unauthorized Request");
        }
        // VERIFY THE TOKEN
        const decodedToken = jsonwebtoken_1.default.verify(token, (_c = process.env.ACCESS_TOKEN_SECRET) !== null && _c !== void 0 ? _c : "");
        // GET USER FROM DB
        const user = await user_model_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id).select("-password -refreshToken");
        // THROW NEW IF ACCESS TOKEN IF INVALID
        if (!user) {
            throw new apiError_1.ApiError(401, "invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new apiError_1.ApiError(401, (error === null || error === void 0 ? void 0 : error.message) || "Invalid Access Token");
    }
});
//# sourceMappingURL=auth.middleware.js.map