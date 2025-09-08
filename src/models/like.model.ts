import { Schema, model } from "mongoose";
import { ILike, LikeModel } from "../types/like.types";

const likeSchema = new Schema<ILike>(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Like = model<ILike, LikeModel>("Like", likeSchema);
