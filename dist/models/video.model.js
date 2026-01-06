"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const playlist_model_1 = require("./playlist.model");
const comment_model_1 = require("./comment.model");
const like_model_1 = require("./like.model");
const mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
const fileOperation_1 = require("../utils/fileOperation");
const videoSchema = new mongoose_1.Schema({
    video: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
videoSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
        await (0, fileOperation_1.deleteFromCloudinary)(doc.video, "video");
        await (0, fileOperation_1.deleteFromCloudinary)(doc.thumbnail);
        // Remove those videos from all playlists
        await playlist_model_1.Playlist.updateMany({ videos: { $in: [doc._id] } }, { $pull: { videos: { $in: [doc._id] } } });
        await comment_model_1.Comment.deleteMany({ video: doc._id });
        await like_model_1.Like.deleteMany({ video: doc._id });
    }
    next();
});
videoSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();
    const deletedVideos = await this.model.find(filter).select("_id thumbnail video");
    const videoIds = deletedVideos.map((v) => v._id);
    for (const video of deletedVideos) {
        await (0, fileOperation_1.deleteFromCloudinary)(video.video, "video");
        await (0, fileOperation_1.deleteFromCloudinary)(video.thumbnail);
    }
    await playlist_model_1.Playlist.updateMany({ videos: { $in: videoIds } }, { $pull: { videos: { $in: videoIds } } });
    await comment_model_1.Comment.deleteMany({ video: { $in: videoIds } });
    await like_model_1.Like.deleteMany({ video: { $in: videoIds } });
});
videoSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
exports.Video = (0, mongoose_1.model)("Video", videoSchema);
//# sourceMappingURL=video.model.js.map