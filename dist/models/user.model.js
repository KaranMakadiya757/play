"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const video_model_1 = require("./video.model");
const comment_model_1 = require("./comment.model");
const playlist_model_1 = require("./playlist.model");
const subscription_model_1 = require("./subscription.model");
const tweet_model_1 = require("./tweet.model");
const like_model_1 = require("./like.model");
const fileOperation_1 = require("../utils/fileOperation");
const mongoose_2 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    watchhistory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    password: {
        type: String,
        required: [true, "Please Enter Valid password"],
    },
    otp: {
        type: String,
    },
    otp_expiry: {
        type: Date,
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await bcrypt_1.default.hash(this.password, 10);
    if (this.isModified("otp") && this.otp)
        this.otp = await bcrypt_1.default.hash(this.otp, 10);
    next();
});
userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getQuery());
    await (0, fileOperation_1.deleteFromCloudinary)(user.avatar);
    user.coverimage && (await (0, fileOperation_1.deleteFromCloudinary)(user.coverimage));
    await video_model_1.Video.deleteMany({ owner: user._id });
    await comment_model_1.Comment.deleteMany({ owner: user._id });
    await tweet_model_1.Tweet.deleteMany({ owner: user._id });
    await playlist_model_1.Playlist.deleteMany({ owner: user._id });
    await like_model_1.Like.deleteMany({ likedBy: user._id });
    await subscription_model_1.Subscription.deleteMany({ subscriber: user._id });
    await subscription_model_1.Subscription.deleteMany({ channel: user._id });
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
userSchema.methods.isOtpCorrect = async function (otp) {
    if (!this.otp)
        return false;
    const isValid = await bcrypt_1.default.compare(otp, this.otp);
    const isExpired = this.otp_expiry ? new Date() > this.otp_expiry : false;
    return isValid && !isExpired;
};
userSchema.methods.generateAccessToken = function () {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret)
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    const options = {};
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;
    if (expiresIn)
        options.expiresIn = expiresIn;
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, secret, options);
};
userSchema.methods.generateRefreshToken = function () {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret)
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    const options = {};
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;
    if (expiresIn)
        options.expiresIn = expiresIn;
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, secret, options);
};
userSchema.methods.generateAccessAndRefreshTokens = async function () {
    const accessToken = await this.generateAccessToken();
    const refreshToken = await this.generateRefreshToken();
    this.refreshToken = refreshToken;
    await this.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};
exports.User = mongoose_2.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map