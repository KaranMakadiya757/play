import { Schema, model } from "mongoose";
import { Like } from "./like.model";
import { ITweet, TweetModel } from "../types/tweet.types";

const tweetSchema = new Schema<ITweet>(
    {
        content: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

tweetSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) await Like.deleteMany({ comment: doc._id });

    next();
});

tweetSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();

    const deletedTweets = await this.model.find(filter).select("_id");

    const tweetIds = deletedTweets.map((v) => v._id);

    await Like.deleteMany({ comment: { $in: tweetIds } });
});

export const Tweet = model<ITweet, TweetModel>("Tweet", tweetSchema);
