"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const mongoose_1 = require("mongoose");
const like_model_1 = require("./like.model");
const tweetSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
tweetSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc)
        await like_model_1.Like.deleteMany({ comment: doc._id });
    next();
});
tweetSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();
    const deletedTweets = await this.model.find(filter).select("_id");
    const tweetIds = deletedTweets.map((v) => v._id);
    await like_model_1.Like.deleteMany({ comment: { $in: tweetIds } });
});
exports.Tweet = (0, mongoose_1.model)("Tweet", tweetSchema);
//# sourceMappingURL=tweet.model.js.map