import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { Video } from "./video.model";
import { Comment } from "./comment.model";
import { Playlist } from "./playlist.model";
import { Subscription } from "./subscription.model";
import { Tweet } from "./tweet.model";
import { Like } from "./like.model";
import { deleteFromCloudinary } from "../utils/fileOperation";
import { IUser, IUserMethods, UserModel } from "../types/user.types";
import mongoose from "mongoose";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
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
                type: Schema.Types.ObjectId,
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
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);

    if (this.isModified("otp") && this.otp) this.otp = await bcrypt.hash(this.otp, 10);

    next();
});

userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getQuery());

    await deleteFromCloudinary(user.avatar);
    user.coverimage && (await deleteFromCloudinary(user.coverimage));

    await Video.deleteMany({ owner: user._id });
    await Comment.deleteMany({ owner: user._id });
    await Tweet.deleteMany({ owner: user._id });
    await Playlist.deleteMany({ owner: user._id });
    await Like.deleteMany({ likedBy: user._id });
    await Subscription.deleteMany({ subscriber: user._id });
    await Subscription.deleteMany({ channel: user._id });

    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.isOtpCorrect = async function (otp) {
    if (!this.otp) return false;

    const isValid = await bcrypt.compare(otp, this.otp);
    const isExpired = this.otp_expiry ? new Date() > this.otp_expiry : false;

    return isValid && !isExpired;
};

userSchema.methods.generateAccessToken = function () {
    const secret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret | undefined;
    if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

    const options: jwt.SignOptions = {};
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;
    if (expiresIn) options.expiresIn = expiresIn as jwt.SignOptions["expiresIn"];

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        secret,
        options
    );
};

userSchema.methods.generateRefreshToken = function () {
    const secret = process.env.REFRESH_TOKEN_SECRET as jwt.Secret | undefined;
    if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");

    const options: jwt.SignOptions = {};
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;
    if (expiresIn) options.expiresIn = expiresIn as jwt.SignOptions["expiresIn"];

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        secret,
        options
    );
};

userSchema.methods.generateAccessAndRefreshTokens = async function () {
    const accessToken = await this.generateAccessToken();
    const refreshToken = await this.generateRefreshToken();

    this.refreshToken = refreshToken;
    await this.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
