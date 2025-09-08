import { HydratedDocument, Model, Types } from "mongoose";

export interface ILike {
    video: Types.ObjectId;
    comment: Types.ObjectId;
    tweet: Types.ObjectId;
    likedBy: Types.ObjectId;
}

export type ILikeDocument = HydratedDocument<ILike>;

export type LikeModel = Model<ILikeDocument>;
