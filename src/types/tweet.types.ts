import { HydratedDocument, Model, Types } from "mongoose";

export interface ITweet {
    content: String;
    owner: Types.ObjectId;
}

export type ITweetDocument = HydratedDocument<ITweet>;

export type TweetModel = Model<ITweetDocument>;
