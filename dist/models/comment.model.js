"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
const like_model_1 = require("./like.model");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    video: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
commentSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
commentSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc)
        await like_model_1.Like.deleteMany({ comment: doc._id });
    next();
});
commentSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();
    const deletedComments = await this.model.find(filter).select("_id");
    const commentIds = deletedComments.map((v) => v._id);
    await like_model_1.Like.deleteMany({ comment: { $in: commentIds } });
});
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
//# sourceMappingURL=comment.model.js.map