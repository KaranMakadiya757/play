import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Schema, model } from "mongoose";
import { Video } from "./video.model.js"
import { Comment } from "./comment.model.js"
import { Playlist } from "./playlist.model.js"
import { Subscription } from "./subscription.model.js"
import { Tweet } from "./tweet.model.js"
import { Like } from "./like.model.js"
import { deleteFromCloudinary } from "../utils/fileOperation.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
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
                ref: 'Video'
            }
        ],
        password: {
            type: String,
            required: [true, "Please Enter Valid password"]
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getQuery());

    await deleteFromCloudinary(user.avatar);
    user.coverimage && await deleteFromCloudinary(user.coverimage);

    await Video.deleteMany({ owner: user._id });
    await Comment.deleteMany({ owner: user._id });
    await Tweet.deleteMany({ owner: user._id });
    await Playlist.deleteMany({ owner: user._id });
    await Like.deleteMany({ likedBy: user._id });
    await Subscription.deleteMany({ subscriber: user._id });
    await Subscription.deleteMany({ channel: user._id });

    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFERSH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFERSH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", userSchema)